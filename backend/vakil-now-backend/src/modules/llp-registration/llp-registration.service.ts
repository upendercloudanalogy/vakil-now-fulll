import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { schema } from "src/db/schema";
import { S3Service } from "src/global/aws-s3/aws-s3.service";
import { UploadService } from "src/global/upload/upload.service";
import { capitalizeFirstLetter } from "src/utilis";
import { UpdateLlpInfoDto } from "./dto/llp-details.dto";
import { CreatePartnerDto } from "./dto/partner.dto";


@Injectable()
export class LLPService {
  constructor(
    private uploadService: UploadService,
    private s3Service: S3Service,
    @Inject('DrizzleAsyncProvider') private db: any
  ) { }

  async checkName(companyName: string) {
    const name = companyName?.trim();

    if (!name) {
      throw new BadRequestException("Company name is required");
    }

    try {
      return await this.db.transaction(async (tx: any) => {
        const existing = await tx
          .select({ id: schema.llpRegistration.id })
          .from(schema.llpRegistration)
          .where(eq(schema.llpRegistration.companyName, name))
          .limit(1);

        if (existing.length === 0) {
          return {
            available: true,
            message: "Name is available",
          };
        }

        function generateShortUniqueSuffix(): string {
          // 1️⃣ Unix timestamp in seconds → base36 (time ordering)
          const timePart = Math.floor(Date.now() / 1000).toString(36);

          // 2️⃣ Crypto random → base36
          const randomPart = parseInt(
            randomBytes(3).toString("hex"),
            16,
          ).toString(36);

          // 3️⃣ Combine and slice from right (entropy-safe)
          return `${timePart}${randomPart}`.slice(-6);
        }

        //  Short, strong candidates
        const candidates = Array.from({ length: 5 }).map(
          () => `${name}-${generateShortUniqueSuffix()}`,
        );

        const used = await tx
          .select({ name: schema.llpRegistration.companyName })
          .from(schema.llpRegistration)
          .where(inArray(schema.llpRegistration.companyName, candidates));

        const usedSet = new Set(used.map((r: any) => r.name));

        const suggestions = candidates
          .filter(c => !usedSet.has(c))
          .slice(0, 3);
        return {
          available: false,
          message: "Name not available",
          suggestions,
        };
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Error while checking company name availability",
      );
    }
  }

  async createName(dto: any, userId: string) {
    const rawCompanyName = dto?.companyName?.trim();
    const companyName = capitalizeFirstLetter(rawCompanyName);
    const object = dto?.object;

    if (!companyName) {
      throw new BadRequestException("Company name is required");
    }

    if (!userId) {
      throw new BadRequestException("User not authorized");
    }

    return await this.db.transaction(async (tx: any) => {

      /* 1️⃣ Check if user already has a company */
      const existingForUser = await tx
        .select({ id: schema.llpRegistration.id })
        .from(schema.llpRegistration)
        .where(eq(schema.llpRegistration.userId, userId))
        .for("update");

      if (existingForUser.length > 0) {
        const existingId = existingForUser[0].id;

        const [result] = await tx
          .update(schema.llpRegistration)
          .set({
            companyName, // ✅ capitalized
            object,
          })
          .where(eq(schema.llpRegistration.id, existingId));

        if (!result || result.affectedRows < 1) {
          throw new BadRequestException("Error updating company name");
        }

        return {
          llpId: existingId,
          message: "Company name updated successfully",
        };
      }

      /* 2️⃣ Global uniqueness check */
      const existingGlobal = await tx
        .select({ id: schema.llpRegistration.id })
        .from(schema.llpRegistration)
        .where(eq(schema.llpRegistration.companyName, companyName))
        .for("update");

      if (existingGlobal.length > 0) {
        throw new ConflictException("Company name already exists");
      }

      /* 3️⃣ Insert new record */
      const [insertResult] = await tx
        .insert(schema.llpRegistration)
        .values({
          companyName, // ✅ capitalized
          object,
          userId,
        });

      if (!insertResult || insertResult.affectedRows !== 1) {
        throw new BadRequestException("Error creating company name");
      }

      const [created] = await tx
        .select({ id: schema.llpRegistration.id })
        .from(schema.llpRegistration)
        .where(eq(schema.llpRegistration.companyName, companyName));

      return {
        llpId: created.id,
        message: "Company name created successfully",
      };
    });
  }

  async createOrUpdatePartners(
    partners: CreatePartnerDto[], 
    files: Express.Multer.File[],
    llpId: string
  ) {
    if (!llpId) {
      throw new BadRequestException("Invalid LLP ID");
    }

    type PartnerInsert = typeof schema.partners.$inferInsert;
    type PartnerSelect = typeof schema.partners.$inferSelect;

    /* =====================================================
       1️⃣ BUILD BASE PARTNER MAP
    ===================================================== */

    const partnerMap: Record<number, PartnerInsert> = {};

    partners.forEach((partner, index) => {
      partnerMap[index] = {
        id: partner.id ?? crypto.randomUUID(),
        llpId,
        name: capitalizeFirstLetter(partner.name),
        email: partner.emailId ?? null,
        mobile: partner.mobileNumber ?? null,
        occupation: partner.occupation ?? null,
        education: partner.education ?? null,
        contributedAmount:
          partner.contributedCapital !== undefined
            ? Number(partner.contributedCapital)
            : null,
        placeOfBirth: partner.placeOfBirth ?? null,
        partnerRatio:
          partner.partnerRatio !== undefined
            ? String(partner.partnerRatio)
            : null,
        dinAvailable: Boolean(partner.dinAvailable),
        dinNumber:
          partner.dinAvailable === true
            ? partner.dinNumber ?? null
            : null,
        dscAvailable: Boolean(partner.dscAvailable),
      };
    });

    const partnerIds = Object.values(partnerMap).map(p => p.id!);

    /* =====================================================
       2️⃣ FETCH EXISTING PARTNERS (ONCE)
    ===================================================== */

    const existingPartners = await this.db
      .select()
      .from(schema.partners)
      .where(inArray(schema.partners.id, partnerIds));

    const existingMap = new Map<string, PartnerSelect>(
      existingPartners.map((p: any) => [p.id, p])
    );

    const deletedPartners = partners.filter(
      (p) => p.deleted === true && p.id
    );

    if (deletedPartners.length > 0) {
      for (const partner of deletedPartners) {
        const existing = existingMap.get(partner.id!);
        if (!existing) continue;

        /* 1️⃣ DELETE eSign documents FIRST */
        await this.db
          .delete(schema.esignDocuments)
          .where(eq(schema.esignDocuments.partnerId, partner.id!));

        //  Soft Delete: S3 files are NOT deleted.

        //  Delete DB row
        await this.db
          .delete(schema.partners)
          .where(eq(schema.partners.id, partner.id!));
      }
    }
    const activePartners = partners.filter(p => p.deleted !== true);
    /* =====================================================
       3️⃣ PARALLEL S3 DELETIONS (SKIPPED - SOFT DELETE)
    ===================================================== */

    // const deleteTasks: Promise<void>[] = []; // Removed for soft delete
    const deleteUpdates: Record<string, Partial<PartnerInsert>> = {};

    activePartners.forEach((partner, index) => {

      const partnerId = partnerMap[index].id!;
      const existing = existingMap.get(partnerId);
      if (!existing) return;

      const update: Partial<PartnerInsert> = {};

      if (partner.removePicture && existing.profilePicKey) {
        // deleteTasks.push(this.s3Service.delete(existing.profilePicKey));
        update.profilePicKey = null;
      }

      if (partner.removeIdentityProof && existing.idProofKey) {
        // deleteTasks.push(this.s3Service.delete(existing.idProofKey));
        update.idProofKey = null;
      }

      if (partner.removeResidentialProof && existing.residentialProofKey) {
        // deleteTasks.push(this.s3Service.delete(existing.residentialProofKey));
        update.residentialProofKey = null;
      }

      if (partner.removePanCard && existing.panCardKey) {
        // deleteTasks.push(this.s3Service.delete(existing.panCardKey));
        update.panCardKey = null;
      }

      if (Object.keys(update).length > 0) {
        deleteUpdates[partnerId] = update;
      }
    });

    // await Promise.all(deleteTasks);

    const uploadResults = await Promise.all(
      (files ?? []).map(async (file) => {
        const index = Number(file.fieldname.split("_").pop());
        if (Number.isNaN(index) || !partnerMap[index]) return null;

        // ✅ MIME TYPE VALIDATION 
        if (
          file.fieldname.startsWith("picture_") ||
          file.fieldname.startsWith("panCard_")
        ) {
          const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
              "Profile picture and PAN must be JPEG, JPG, or PNG"
            );
          }
        }

        if (
          file.fieldname.startsWith("identityProof_") ||
          file.fieldname.startsWith("residentialProof_")
        ) {
          const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf",
          ];
          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
              "Identity and Residential proofs must be image or PDF"
            );
          }
        }

        const partnerId = partnerMap[index].id!;
        const key = await this.uploadService.upload(
          file,
          "llp/partners",
          partnerId
        );

        return { index, fieldname: file.fieldname, key };
      })
    );


    const uploadedFileMap: Record<number, Partial<PartnerInsert>> = {};

    uploadResults.filter(Boolean).forEach((r: any) => {
      uploadedFileMap[r.index] ??= {};

      if (r.fieldname.startsWith("picture_")) {
        uploadedFileMap[r.index].profilePicKey = r.key;
      } else if (r.fieldname.startsWith("identityProof_")) {
        uploadedFileMap[r.index].idProofKey = r.key;
      } else if (r.fieldname.startsWith("residentialProof_")) {
        uploadedFileMap[r.index].residentialProofKey = r.key;
      } else if (r.fieldname.startsWith("panCard_")) {
        uploadedFileMap[r.index].panCardKey = r.key;
      }
    });

    /* =====================================================
       5️⃣ TRANSACTIONAL DB WRITE
    ===================================================== */

    const savedPartners: PartnerSelect[] = [];

    await this.db.transaction(async (tx: any) => {
      for (const index of Object.keys(partnerMap)) {
        const i = Number(index);
        const base = partnerMap[i];
        const deletes = deleteUpdates[base.id!] ?? {};
        const uploads = uploadedFileMap[i] ?? {};

        const finalUpdate: PartnerInsert = {
          ...base,
          ...deletes,
          ...uploads,
        };

        if (existingMap.has(base.id!)) {
          await tx
            .update(schema.partners)
            .set(finalUpdate)
            .where(eq(schema.partners.id, base.id!));
        } else {
          await tx
            .insert(schema.partners)
            .values(finalUpdate);
        }

        savedPartners.push(finalUpdate as PartnerSelect);
      }
    });

    /* =====================================================
       6️⃣ SIGNED URL RESPONSE
    ===================================================== */

    const partnersWithFiles = await Promise.all(
      savedPartners.map(async (p) => ({
        ...p,
        dinNumber: p.dinNumber ?? null,
        files: {
          picture: p.profilePicKey
            ? await this.s3Service.getSignedUrl(p.profilePicKey)
            : null,
          identityProof: p.idProofKey
            ? await this.s3Service.getSignedUrl(p.idProofKey)
            : null,
          residentialProof: p.residentialProofKey
            ? await this.s3Service.getSignedUrl(p.residentialProofKey)
            : null,
          panCard: p.panCardKey
            ? await this.s3Service.getSignedUrl(p.panCardKey)
            : null,
        },
      }))
    );

    return {
      message: "Partners saved successfully",
      totalPartners: partnersWithFiles.length,
      partners: partnersWithFiles,
    };
  }

  async createOrUpdateLLP(
    llpId: string,
    dto: UpdateLlpInfoDto,
    // files: Record<string, Express.Multer.File>
    files: {
      residentialProof?: Express.Multer.File;
      noc?: Express.Multer.File;
    }
  ) {




    if (!llpId) {
      throw new BadRequestException("Invalid LLP ID");
    }

    const hasTextChanges =
      !!dto.email ||
      !!dto.mobileNumber1 ||
      !!dto.mobileNumber2 ||
      !!dto.address ||
      !!dto.durationOfStay;

    // const hasFileChanges =
    //   !!files.residentialProof || !!files.noc;
    const hasFileChanges =
      !!files.residentialProof ||
      !!files.noc ||
      dto.removeResidentialProof === true ||
      dto.removeNoc === true;


    //  NO CHANGES → EXIT EARLY
    if (!hasTextChanges && !hasFileChanges) {
      return {
        message: "No changes detected",
        llpId,
        uploadedFiles: {},
      };
    }


    return await this.db.transaction(async (tx: any) => {

      /* =====================================================
         0️⃣ PREPARE UPDATE OBJECT (MUST BE FIRST)
      ===================================================== */

      const updateData: any = {};

      /* =====================================================
          DELETE EXISTING FILES (USES updateData)
      ===================================================== */


      if (dto.removeNoc) {
        // Soft delete: S3 file NOT deleted
        updateData.nocKey = sql`null`;
      }

      if (dto.removeResidentialProof) {
        // Soft delete: S3 file NOT deleted
        updateData.residentialProofKey = sql`null`;
      }

      /* =====================================================
         1️⃣ UPLOAD FILES → STORE KEYS ONLY
      ===================================================== */

      const uploadedKeys: Partial<
        Record<"residentialProof" | "noc", string>
      > = {};

      if (files.residentialProof) {
        uploadedKeys.residentialProof =
          await this.uploadService.upload(
            files.residentialProof,
            "llp/llp-docs",
            llpId
          );
      }

      if (files.noc) {
        uploadedKeys.noc =
          await this.uploadService.upload(
            files.noc,
            "llp/llp-docs",
            llpId
          );
      }

      /* =====================================================
         2️⃣ TEXT FIELDS
      ===================================================== */

      if (dto.email) updateData.llpEmail = dto.email;
      if (dto.mobileNumber1) updateData.llpMobile1 = dto.mobileNumber1;
      if (dto.mobileNumber2) updateData.llpMobile2 = dto.mobileNumber2;
      if (dto.address)
        updateData.registeredOfficeAddress = dto.address;
      if (dto.durationOfStay)
        updateData.stayDurationYears = dto.durationOfStay;

      /* =====================================================
         3️⃣ APPLY UPLOAD KEYS (UPLOAD OVERRIDES DELETE)
      ===================================================== */

      if (uploadedKeys.residentialProof) {
        updateData.residentialProofKey = uploadedKeys.residentialProof;
      }

      if (uploadedKeys.noc) {
        updateData.nocKey = uploadedKeys.noc;
      }

      /* =====================================================
         4️⃣ UPDATE DB
      ===================================================== */

      const result = await tx
        .update(schema.llpRegistration)
        .set(updateData)
        .where(eq(schema.llpRegistration.id, llpId));

      if (!result || result.affectedRows === 0) {
        throw new BadRequestException("LLP update failed");
      }

      /* =====================================================
         5️⃣ SIGNED URL RESPONSE
      ===================================================== */

      const signedFiles: Partial<
        Record<"residentialProof" | "noc", string>
      > = {};

      if (uploadedKeys.residentialProof) {
        signedFiles.residentialProof =
          await this.s3Service.getSignedUrl(
            uploadedKeys.residentialProof
          );
      }

      if (uploadedKeys.noc) {
        signedFiles.noc =
          await this.s3Service.getSignedUrl(
            uploadedKeys.noc
          );
      }

      console.log("signedFiles", signedFiles);
      return {
        message: "LLP updated successfully",
        llpId,
        uploadedFiles: signedFiles,
      };
    });


  }

  async uploadEsign(
    llpId: string,
    files: {
      subscriberSheet?: Express.Multer.File[];
      form9?: Express.Multer.File[];
    },
    metadata: Record<string, { partnerId: string; type: "form9" }> = {}
  ) {
    if (!llpId) {
      throw new BadRequestException("Invalid LLP ID");
    }

    const subscriberSheet = files.subscriberSheet?.[0];
    const form9Files = files.form9 ?? [];

    /* ---------- METADATA ---------- */
    /* ---------- METADATA ---------- */
    // metadata is handled manually in controller now

    /* ================= TRANSACTION ================= */
    await this.db.transaction(async (tx: any) => {

      /* ---------- SUBSCRIBER SHEET ---------- */
      if (subscriberSheet) {
        const key = await this.uploadService.upload(
          subscriberSheet,
          "llp/subscriber-sheet",
          llpId
        );

        await tx
          .update(schema.llpRegistration)
          .set({ subscriberSheetKey: key })
          .where(eq(schema.llpRegistration.id, llpId));

        const existing = await tx
          .select()
          .from(schema.esignDocuments)
          .where(
            and(
              eq(schema.esignDocuments.llpId, llpId),
              isNull(schema.esignDocuments.partnerId),
              eq(schema.esignDocuments.documentType, "subscriberSheet")
            )
          );

        if (existing.length) {
          await tx
            .update(schema.esignDocuments)
            .set({
              pdfKey: key,
              fileName: subscriberSheet.originalname,
              signed: false,
            })
            .where(eq(schema.esignDocuments.id, existing[0].id));
        } else {
          await tx.insert(schema.esignDocuments).values({
            llpId,
            partnerId: null,
            documentType: "subscriberSheet",
            pdfKey: key,
            fileName: subscriberSheet.originalname,
            signed: false,
          });
        }
      }

      /* ---------- FORM-9 FILES ---------- */
      for (let i = 0; i < form9Files.length; i++) {
        const file = form9Files[i];
        const meta = metadata[`form9_${i}`];

        if (!meta) {
          throw new BadRequestException(`Missing metadata for form9_${i}`);
        }

        const { partnerId, type } = meta;

        if (type !== "form9") {
          throw new BadRequestException("Invalid document type");
        }

        const key = await this.uploadService.upload(
          file,
          "llp/form9",
          partnerId
        );

        const existing = await tx
          .select()
          .from(schema.esignDocuments)
          .where(
            and(
              eq(schema.esignDocuments.llpId, llpId),
              eq(schema.esignDocuments.partnerId, partnerId),
              eq(schema.esignDocuments.documentType, "form9")
            )
          );

        if (existing.length) {
          await tx
            .update(schema.esignDocuments)
            .set({
              pdfKey: key,
              fileName: file.originalname,
              signed: false,
            })
            .where(eq(schema.esignDocuments.id, existing[0].id));
        } else {
          await tx.insert(schema.esignDocuments).values({
            llpId,
            partnerId,
            documentType: "form9",
            pdfKey: key,
            fileName: file.originalname,
            signed: false,
          });
        }
      }
    });

    /* ================= AUTHORITATIVE RESPONSE ================= */

    const subscriberSheetDoc = await this.db
      .select({
        fileName: schema.esignDocuments.fileName,
        pdfKey: schema.esignDocuments.pdfKey,
      })
      .from(schema.esignDocuments)
      .where(
        and(
          eq(schema.esignDocuments.llpId, llpId),
          isNull(schema.esignDocuments.partnerId),
          eq(schema.esignDocuments.documentType, "subscriberSheet")
        )
      );

    const partnerDocs = await this.db
      .select({
        id: schema.partners.id,
        fileName: schema.esignDocuments.fileName,
        pdfKey: schema.esignDocuments.pdfKey,
      })
      .from(schema.partners)
      .leftJoin(
        schema.esignDocuments,
        and(
          eq(schema.esignDocuments.partnerId, schema.partners.id),
          eq(schema.esignDocuments.documentType, "form9")
        )
      )
      .where(eq(schema.partners.llpId, llpId));

    return {
      llpData: {
        subscriberSheet: subscriberSheetDoc[0]
          ? {
            fileName: subscriberSheetDoc[0].fileName,
            signedUrl: await this.s3Service.getSignedUrl(
              subscriberSheetDoc[0].pdfKey
            ),
          }
          : null,
      },

      partners: await Promise.all(
        partnerDocs.map(async (p: any) => ({
          id: p.id,
          esignDocuments: p.fileName
            ? {
              form9: {
                fileName: p.fileName,
                signedUrl: p.pdfKey
                  ? await this.s3Service.getSignedUrl(p.pdfKey)
                  : undefined,
              },
            }
            : undefined,
        }))
      ),
    };
  }

  async getLlpsByUserId(userId: string) {
    console.log('Querying for userId:', userId);

    if (!userId) {
      throw new BadRequestException("Invalid userId");
    }

    /* ================= HELPERS ================= */
    const isEmpty = (v: any) => v === null || v === undefined || v === "";

    const extractSubscriberFileName = (key: string) => {
      // llp/subscriber-sheet/YYYY-MM-DD-UUID-originalFileName
      const filePart = key.split("/").pop()!; // remove folder
      return filePart.split("-").slice(8).join("-");
    };


    const isLlpCompleted = (llp: any): boolean => {
      const required = [
        llp.companyName,
        llp.object,
        llp.llpEmail,
        llp.llpMobile1,
        llp.registeredOfficeAddress,
        // llp.stayDurationYears,
        llp.subscriberSheetKey,
        llp.residentialProofKey,
      ];
      return required.every(v => !isEmpty(v));
    };

    const isPartnerCompleted = (p: any): boolean => {
      const baseRequired = [
        p.name,
        p.email,
        p.mobile,
        p.occupation,
        p.education,
        p.contributedAmount,
        p.placeOfBirth,
        p.partnerRatio,
        p.profilePicKey,
        p.idProofKey,
        p.residentialProofKey,
        p.panCardKey,
      ];

      //  Base mandatory fields missing
      if (!baseRequired.every(v => !isEmpty(v))) {
        return false;
      }

      //  DIN = NO → partner is complete
      if (p.dinAvailable === false) {
        return true;
      }

      //  DIN = YES → DIN number must exist
      if (p.dinAvailable === true) {
        return !isEmpty(p.dinNumber);
      }

      return false;
    };



    const isEsignCompleted = (p: any): boolean => {
      return Boolean(p.esignDocuments?.form9);
    };

    try {
      const allRows = await this.db.select().from(schema.llpRegistration);
console.log('All LLP rows:', allRows);


      const rows = await this.db
        .select({
          llpId: schema.llpRegistration.id,
          fileId: schema.llpRegistration.fileId,
          llpData: schema.llpRegistration,

          partnerId: schema.partners.id,
          partnerData: schema.partners,

          esignId: schema.esignDocuments.id,
          documentType: schema.esignDocuments.documentType,
          pdfKey: schema.esignDocuments.pdfKey,
          fileName: schema.esignDocuments.fileName,
        })
        .from(schema.llpRegistration)
        .leftJoin(
          schema.partners,
          eq(schema.partners.llpId, schema.llpRegistration.id)
        )
        .leftJoin(
          schema.esignDocuments,
          eq(schema.esignDocuments.partnerId, schema.partners.id)
        )
        .where(eq(schema.llpRegistration.userId, userId));


      console.log(rows, 'rows');

      const llpMap: Record<string, any> = {};

      for (const row of rows) {
        console.log(row, 'row');
        /* ================= INIT LLP ================= */
        if (!llpMap[row.llpId]) {
          const llp = row.llpData;

          llpMap[row.llpId] = {
            id: row.llpId,
            llpData: {
              ...llp,

              /* ✅ FIXED subscriberSheet filename */
              subscriberSheet: llp.subscriberSheetKey
                ? {
                  fileName: extractSubscriberFileName(llp.subscriberSheetKey),
                  signedUrl: await this.s3Service.getSignedUrl(
                    llp.subscriberSheetKey
                  ),
                }
                : null,


              residentialProofUrl: llp.residentialProofKey
                ? await this.s3Service.getSignedUrl(llp.residentialProofKey)
                : null,

              nocUrl: llp.nocKey
                ? await this.s3Service.getSignedUrl(llp.nocKey)
                : null,
            },
            partners: {},
          };
        }

        /* ================= INIT PARTNER ================= */
        if (row.partnerId) {
          if (!llpMap[row.llpId].partners[row.partnerId]) {
            const p = row.partnerData;

            llpMap[row.llpId].partners[row.partnerId] = {
              id: row.partnerId,
              name: p?.name ?? "",
              files: {
                picture: p?.profilePicKey
                  ? await this.s3Service.getSignedUrl(p.profilePicKey)
                  : null,
                identityProof: p?.idProofKey
                  ? await this.s3Service.getSignedUrl(p.idProofKey)
                  : null,
                residentialProof: p?.residentialProofKey
                  ? await this.s3Service.getSignedUrl(p.residentialProofKey)
                  : null,
                panCard: p?.panCardKey
                  ? await this.s3Service.getSignedUrl(p.panCardKey)
                  : null,
              },
              esignDocuments: {},
              ...p,
            };
          }

          /* ================= PARTNER eSIGN DOCS ================= */
          if (row.esignId && row.documentType && row.pdfKey) {
            llpMap[row.llpId].partners[row.partnerId].esignDocuments[
              row.documentType
            ] = {
              fileName: row.fileName,
              signedUrl: await this.s3Service.getSignedUrl(row.pdfKey),
            };
          }
        }
      }

      /* ================= FINAL RESPONSE ================= */
      return Object.values(llpMap).map((llp: any) => {
        const partners = Object.values(llp.partners);

        const step1 = Boolean(
          llp.llpData.companyName &&
          llp.llpData.object
        );

        const step2 =
          step1 &&
          partners.length > 0 &&
          partners.every((p: any) => isPartnerCompleted(p));

        const step3 =
          step2 && // 🔒 CRITICAL LOCK
          Boolean(
            llp.llpData.llpEmail &&
            llp.llpData.llpMobile1 &&
            llp.llpData.registeredOfficeAddress &&
            (llp.llpData.residentialProofKey || llp.llpData.residentialProofUrl) &&
            (llp.llpData.nocKey || llp.llpData.nocUrl)
          );


        const step4 =
          step3 &&
          partners.length > 0 &&
          partners.every((p: any) => isEsignCompleted(p));

        const stepStatus = {
          nameFinalization: step1,
          partners: step2,
          llpInfo: step3,
          esign: step4,
        };

        console.log({
          ...llp,
          partners,
          stepStatus,
          isCompleted: Object.values(stepStatus).every(Boolean)
        }, 'return values')
        return {
          ...llp,
          partners,
          stepStatus,
          isCompleted: Object.values(stepStatus).every(Boolean),
        };

      });
    } catch (error) {
      console.log(error, 'error ');

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        "Error fetching LLP details for user"
      );
    }
  }
}
