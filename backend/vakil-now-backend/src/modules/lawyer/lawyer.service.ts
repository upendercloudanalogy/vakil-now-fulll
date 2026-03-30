import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { schema } from "src/db/schema";
import { S3Service } from "src/global/aws-s3/aws-s3.service";
import { SocketService } from "src/global/sockets/socket.service";
import { UploadService } from "src/global/upload/upload.service";



@Injectable()
export class LawyerService {
  constructor(
    private uploadService: UploadService,
    private s3Service: S3Service,
    private socketService: SocketService,
    @Inject('DrizzleAsyncProvider') private db: any
  ) { }

  async saveIdentity(body: any, files: any, req: any) {
    try {
      const fullName = body?.fullName?.trim();
      const mobileNumber = body?.mobileNumber?.trim();
      const emailAddress = body?.emailAddress?.trim();
      const gender = body?.gender?.trim();
      const barRegistrationNumber = body?.barRegistrationNumber?.trim();
      const barCouncilState = body?.barCouncilState?.trim();
      const collegeName = body?.collegeName?.trim();
      const highestQualification = body?.highestQualification?.trim();
      const newProfilePhoto = files?.profilePhoto?.[0];
      const newGovernmentId = files?.governmentId?.[0];
      const newBarCouncilId = files?.barCouncilId?.[0];

      if (!fullName || !mobileNumber || !emailAddress || !gender || !barRegistrationNumber || !barCouncilState || !collegeName || !highestQualification) {
        throw new Error("Required text fields are missing.");
      }

      const userId = req?.userId;
      if (!userId) {
        throw new Error("can not find user")
      }

      // 4. Mobile & Email Format Checks
      if (mobileNumber.length !== 10 || isNaN(Number(mobileNumber))) {
        throw new Error("Invalid mobile number. Must be 10 digits.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        throw new Error("Invalid email format.");
      }

      // Fetch existing profile to check for already uploaded files
      const [existingProfile] = await this.db
        .select()
        .from(schema.lawyerProfiles)
        .where(eq(schema.lawyerProfiles.userId, userId));

      // 5. File Presence Checks
      const hasProfilePhoto = newProfilePhoto || existingProfile?.profilePhotoKey;
      const hasGovernmentId = newGovernmentId || existingProfile?.governmentIdKey;
      const hasBarCouncilId = newBarCouncilId || existingProfile?.barCouncilIdKey;

      if (!hasProfilePhoto || !hasGovernmentId || !hasBarCouncilId) {
        throw new Error("All required documents (Photo, ID, Bar ID) must be uploaded.");
      }

      const allowedMimetypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (newProfilePhoto && !allowedMimetypes.includes(newProfilePhoto.mimetype)) {
        throw new Error("Profile photo must be a JPEG or PNG.");
      }
      if (newGovernmentId && !allowedMimetypes.includes(newGovernmentId.mimetype)) {
        throw new Error("Government Id must be a JPEG or PNG.");
      }
      if (newBarCouncilId && !allowedMimetypes.includes(newBarCouncilId.mimetype)) {
        throw new Error("Bar Council Id must be a JPEG or PNG.");
      }

      return await this.db.transaction(async (tx: any) => {

        const [lawyerProfile] = await tx.insert(schema.lawyerProfiles).values({
          userId,
          fullName,
          mobileNumber,
          emailAddress,
          gender,
          barRegistrationNumber,
          barCouncilState,
          collegeName,
          highestQualification
        })
          .onDuplicateKeyUpdate({
            set: {
              fullName,
              mobileNumber,
              emailAddress,
              gender,
              barRegistrationNumber,
              barCouncilState,
              collegeName,
              highestQualification,
            },
          });


        const [profile] = await tx
          .select()
          .from(schema.lawyerProfiles)
          .where(eq(schema.lawyerProfiles.userId, userId));

        const lawyerProfileId = profile?.id;

        if (!lawyerProfileId) {
          throw new Error("Failed to create lawyer profile.");
        }

        let profilePhotoKey = existingProfile?.profilePhotoKey;
        let governmentIdKey = existingProfile?.governmentIdKey;
        let barCouncilIdKey = existingProfile?.barCouncilIdKey;

        if (newProfilePhoto) {
          profilePhotoKey = await this.uploadService.upload(newProfilePhoto, "lawyer-onboarding/profilePhoto", lawyerProfileId);
        }
        if (newGovernmentId) {
          governmentIdKey = await this.uploadService.upload(newGovernmentId, "lawyer-onboarding/governmentId", lawyerProfileId);
        }
        if (newBarCouncilId) {
          barCouncilIdKey = await this.uploadService.upload(newBarCouncilId, "lawyer-onboarding/barCouncilId", lawyerProfileId);
        }

        if (!profilePhotoKey || !governmentIdKey || !barCouncilIdKey) {
          throw new Error("error in s3 saving of files")
        }


        await tx
          .update(schema.lawyerProfiles)
          .set({
            profilePhotoKey,
            governmentIdKey,
            barCouncilIdKey,
          })
          .where(eq(schema.lawyerProfiles.id, lawyerProfileId));

        const profilePhotoSignedUrl = await this.s3Service.getSignedUrl(profilePhotoKey);
        const governmentIdSignedUrl = await this.s3Service.getSignedUrl(governmentIdKey);
        const barCouncilIdSignedUrl = await this.s3Service.getSignedUrl(barCouncilIdKey);


        return {
          success: true,
          message: "Identity saved successfully",
          identity: {
            fullName: profile?.fullName,
            mobileNumber: profile?.mobileNumber,
            emailAddress: profile?.emailAddress,
            gender: profile?.gender,
            barRegistrationNumber: profile?.barRegistrationNumber,
            barCouncilState: profile?.barCouncilState,
            collegeName: profile?.collegeName,
            highestQualification: profile?.highestQualification,
            profilePhoto: profilePhotoSignedUrl,
            governmentId: governmentIdSignedUrl,
            barCouncilId: barCouncilIdSignedUrl
          }
        }
      })

    } catch (error) {
      console.log('err=>', error);

      throw new Error(error.message || "An unexpected error occurred during onboarding.");
    }
  }

  async saveProfessionalStructure(body: any, req: any) {
    try {
      const servicesWillingToProvide = body?.servicesWillingToProvide?.trim();
      const practiceType = body?.practiceType?.trim();
      const officeAddressLine1 = body?.officeAddressLine1?.trim();
      const officeAddressLine2 = body?.officeAddressLine2?.trim();
      const city = body?.city?.trim();
      const state = body?.state?.trim();
      const pinCode = body?.pinCode?.trim();
      const country = body?.country?.trim();
      const rawwillingToServeOutside = body?.willingToServeOutside?.trim().toLowerCase();


      if (!servicesWillingToProvide || !practiceType || !officeAddressLine1 || !city || !state || !pinCode || !country || !rawwillingToServeOutside) {
        throw new Error("Required feilds are missing")
      }

      let willingToServeOutsideBool;

      if (rawwillingToServeOutside === 'yes') {
        willingToServeOutsideBool = true;
      } else {
        willingToServeOutsideBool = false;
      }

      if (pinCode.length !== 6 || isNaN(Number(pinCode))) {
        throw new Error("Invalid Pin Code. Please provide a 6-digit number.");
      }

      const userId = req?.userId;
      if (!userId) {
        throw new Error("can not find user")
      }

      const [lawerProfile] = await this.db.select({
        id: schema.lawyerProfiles.id
      }).from(schema.lawyerProfiles)
        .where(eq(schema.lawyerProfiles.userId, userId))

      const lawyerProfileId = lawerProfile?.id;

      if (!lawyerProfileId) {
        throw new Error("Lawyer Profile dont exists")
      }


      return await this.db.transaction(async (tx: any) => {
        await tx.insert(schema.lawyerProfessionalDetails).values({
          lawyerId: lawyerProfileId,
          servicesWillingToProvide: servicesWillingToProvide as "Consultation" | "FullLegalService",
          practiceType: practiceType as "Individual" | "LawFirm",
          addressLine1: officeAddressLine1,
          addressLine2: officeAddressLine2,
          city,
          state,
          pinCode,
          country,
          willingToServeOutsideBool,
        })
          .onDuplicateKeyUpdate({
            set: {
              servicesWillingToProvide,
              practiceType,
              officeAddressLine1,
              officeAddressLine2,
              city,
              state,
              pinCode,
              country,
              willingToServeOutsideBool,
            }
          })

        const [fetchProfessionalStructure] = await tx
          .select()
          .from(schema.lawyerProfessionalDetails)
          .where(eq(schema.lawyerProfessionalDetails.lawyerId, lawyerProfileId));

        if (!fetchProfessionalStructure?.id) {
          throw new Error("error in creating or updating the proffessional structure")
        }

        return {
          success: true,
          message: "Professional structure saved successfully",
          professionalStructure: {
            servicesWillingToProvide: fetchProfessionalStructure?.servicesWillingToProvide,
            practiceType: fetchProfessionalStructure?.practiceType,
            officeAddressLine1: fetchProfessionalStructure?.officeAddressLine1,
            officeAddressLine2: fetchProfessionalStructure?.officeAddressLine2,
            city: fetchProfessionalStructure?.city,
            state: fetchProfessionalStructure?.state,
            pinCode: fetchProfessionalStructure?.pinCode,
            country: fetchProfessionalStructure?.country,
            willingToServeOutside: fetchProfessionalStructure?.willingToServeOutsideBool ? 'yes' : 'no',
          },
        };
      })
    } catch (error) {
      throw new Error(error.message || "Failed to save professional structure.");
    }
  }


  async saveExpertise(body: any, req: any) {
    try {
      const userId = req?.userId;
      if (!userId) {
        throw new Error("can not find user")
      }

      const [lawerProfile] = await this.db.select({
        id: schema.lawyerProfiles.id
      }).from(schema.lawyerProfiles)
        .where(eq(schema.lawyerProfiles.userId, userId))

      const lawyerProfileId = lawerProfile?.id;

      if (!lawyerProfileId) {
        throw new Error("Lawyer Profile dont exists")
      }

      const servicesByField = body?.servicesByField;
      // console.log(servicesByField, 'sbf');


      if (!servicesByField || Object.keys(servicesByField).length === 0) {
        throw new Error("At least one expertise field is required.");
      }


      // 3. Database Transaction
      return await this.db.transaction(async (tx: any) => {

        // Batch Insert all expertise rows at once
        await tx.delete(schema.lawyerExpertise)
          .where(eq(schema.lawyerExpertise.lawyerId, lawyerProfileId));

        await tx.insert(schema.lawyerExpertise).values({
          lawyerId: lawyerProfileId,
          servicesByField: JSON.stringify(servicesByField),
        });

        const [fetchSaveExpertise] = await tx
          .select()
          .from(schema.lawyerExpertise)
          .where(eq(schema.lawyerExpertise.lawyerId, lawyerProfileId));

        const formattedExpertise = JSON.parse(fetchSaveExpertise.servicesByField);


        return {
          success: true,
          message: "Expertise saved successfully",
          servicesByField: formattedExpertise
        }
      });

    } catch (error) {
      console.error("Step 3 Error:", error);
      throw new Error(error.message || "Failed to save expertise.");
    }
  }

  async saveFeedback(body: any, req: any) {
    try {
      const bodyString = JSON.stringify(body);
      if (!bodyString) {
        throw new Error("feedback not provided");
      }
      const userId = req?.userId;
      if (!userId) {
        throw new Error("can not find user")
      }

      const [lawerProfile] = await this.db.select({
        id: schema.lawyerProfiles.id
      }).from(schema.lawyerProfiles)
        .where(eq(schema.lawyerProfiles.userId, userId))

      const lawyerProfileId = lawerProfile?.id;

      if (!lawyerProfileId) {
        throw new Error("Lawyer Profile dont exists")
      }


      return await this.db.transaction(async (tx: any) => {
        // Batch Insert all responses
        await tx.delete(schema.lawyerOnboardingFeedback)
          .where(eq(schema.lawyerOnboardingFeedback.lawyerId, lawyerProfileId));

        // --- STEP B: Insert the new updated feedback ---
        await tx.insert(schema.lawyerOnboardingFeedback).values({
          lawyerId: lawyerProfileId,
          responses: bodyString
        })


        const fetchSaveFeedback = await tx.select().from(schema.lawyerOnboardingFeedback).where(eq(schema.lawyerOnboardingFeedback.lawyerId, lawyerProfileId));

        const formatedFeedbackAccordingToBody = JSON.parse(fetchSaveFeedback[0].responses);
        if (!formatedFeedbackAccordingToBody) {
          throw new Error("error occur in the formating")
        }
        await tx.update(schema.lawyerProfiles).set({
          verificationStatus: 'PENDING'
        }).where(eq(schema.lawyerProfiles.id, lawyerProfileId))
        // console.log(fetchSaveFeedback, 'fsf');


        this.socketService.emitToRole('ADMIN', 'new_lawyer_onboarding_request', {
          message: "A new lawyer has submitted registration.",
          userId: req.userId,
          timestamp: new Date()
        })

        return {
          success: true,
          message: "Onboarding feedback saved. Profile submitted for verification.",
          feedback: formatedFeedbackAccordingToBody// Returning original body for Redux as requested
        };
      });

    } catch (error) {
      console.error("Step 4 Error:", error);
      throw new Error(error.message || "Failed to save onboarding feedback.");
    }
  }


  async getFullLawyerOnboardingData(req: any) {
    try {
      const userId = req?.userId;
      if (!userId) {
        throw new BadRequestException("User ID not found in request.");
      }

      // 1. Fetch the Core Profile
      const [profile] = await this.db
        .select()
        .from(schema.lawyerProfiles)
        .where(eq(schema.lawyerProfiles.userId, userId));

      if (!profile || !profile?.id) {
        return { success: false, message: "Profile not found", data: null };
      }

      const lawyerId = profile.id;

      // 2. Fetch all related details in parallel for performance
      const [professionalDetails, expertiseRows, feedbackRows] = await Promise.all([
        this.db
          .select()
          .from(schema.lawyerProfessionalDetails)
          .where(eq(schema.lawyerProfessionalDetails.lawyerId, lawyerId))
          .then((res: any) => res[0]),
        this.db
          .select()
          .from(schema.lawyerExpertise)
          .where(eq(schema.lawyerExpertise.lawyerId, lawyerId)),
        this.db
          .select()
          .from(schema.lawyerOnboardingFeedback)
          .where(eq(schema.lawyerOnboardingFeedback.lawyerId, lawyerId)),
      ]);

      // 3. Format Expertise (same pattern as saveExpertise)
      const formattedExpertise = expertiseRows[0]?.servicesByField
        ? JSON.parse(expertiseRows[0].servicesByField)
        : {};

      const formattedFeedback =
        feedbackRows?.[0]?.responses &&
          feedbackRows[0].responses.trim() !== ""
          ? JSON.parse(feedbackRows[0].responses)
          : {};

      // 4. Format Feedback (same pattern as saveFeedback)
      // const formattedFeedback = JSON.parse(feedbackRows[0]?.responses ? feedbackRows[0]?.responses : "");
      const servicesByField = formattedExpertise;
      const hasIdentity = !!profile.fullName && !!profile.barRegistrationNumber;
      // Sirf city check karne ke bajaye, practiceType ya address check karein jo required hain
      const hasProfessional = !!professionalDetails && !!professionalDetails.practiceType;
      const hasExpertise = Object.keys(servicesByField).length > 0;
      const hasFeedback = !!formattedFeedback?.q1;

      let currentStep = 1;

      // Sahi order: Sabse pehle basic check karo
      if (!hasIdentity) {
        currentStep = 1;
      } else if (!hasProfessional) {
        currentStep = 2; // Identity hai par professional details nahi -> Step 2 dikhao
      } else if (!hasExpertise) {
        currentStep = 3; // Professional details hain par expertise nahi -> Step 3 dikhao
      } else if (!hasFeedback) {
        currentStep = 4; // Expertise hai par feedback nahi -> Step 4 dikhao
      } else {
        currentStep = 4; // Sab hai
      }

      const isSuccessfullyRegistered = hasIdentity && hasProfessional && hasExpertise && hasFeedback;

      let profilePhotoUrl = null;
      let governmentIdUrl = null;
      let barCouncilIdUrl = null;

      if (profile?.profilePhotoKey) {
        profilePhotoUrl = await this.s3Service.getSignedUrl(profile.profilePhotoKey);
      }
      if (profile?.governmentIdKey) {
        governmentIdUrl = await this.s3Service.getSignedUrl(profile.governmentIdKey);
      }
      if (profile?.barCouncilIdKey) {
        barCouncilIdUrl = await this.s3Service.getSignedUrl(profile.barCouncilIdKey);
      }


      return {
        success: true,
        data: {
          currentStep,
          isSuccessfullyRegistered,
          identity: profile ? {
            fullName: profile.fullName,
            mobileNumber: profile.mobileNumber,
            emailAddress: profile.emailAddress,
            gender: profile.gender,
            barRegistrationNumber: profile.barRegistrationNumber,
            barCouncilState: profile.barCouncilState,
            collegeName: profile.collegeName,
            highestQualification: profile.highestQualification,
            verificationStatus: profile.verificationStatus,
            profilePhoto: profilePhotoUrl,
            governmentId: governmentIdUrl,
            barCouncilId: barCouncilIdUrl,
          } : {},
          professionalStructure: professionalDetails ? {
            servicesWillingToProvide: professionalDetails.servicesWillingToProvide,
            practiceType: professionalDetails.practiceType,
            officeAddressLine1: professionalDetails.addressLine1,
            officeAddressLine2: professionalDetails.addressLine2,
            city: professionalDetails.city,
            state: professionalDetails.state,
            pinCode: professionalDetails.pinCode,
            country: professionalDetails.country,
            willingToServeOutside: professionalDetails.willingToServeOutside ? 'yes' : 'no',
          } : {},
          expertise: {
            servicesByField: servicesByField ? servicesByField : {}
          },
          feedback: formattedFeedback ? formattedFeedback : {}
        }
      };

    } catch (error) {
      console.error("GetFullProfile Error:", error);
      throw new InternalServerErrorException(error.message || "Failed to fetch full profile.");
    }
  }

}