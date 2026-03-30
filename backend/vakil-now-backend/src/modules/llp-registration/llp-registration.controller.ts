
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import { UpdateLlpInfoDto } from "./dto/llp-details.dto";
import { LlpNameResponseDto } from "./dto/llp-name-response.dto";
import { NameFinalizationDto } from "./dto/name-finalization.dto";
import { CreatePartnerDto } from "./dto/partner.dto";
import { UpdateLlpResponseDto } from "./dto/update-llp-response.dto";
import { LLPService } from "./llp-registration.service";



@ApiTags("LLP Registration")
@Controller("llp")
export class LLPController {
    constructor(private readonly llpService: LLPService) { }

    // STEP 0 — Check LLP Name Availability
    @Get("check-name")
    @ApiOperation({ summary: "Check LLP name availability" })
    @ApiQuery({
        name: "companyName",
        required: true,
        description: "Proposed LLP name",
        example: "ABC Consulting LLP",
    })
    @ApiResponse({
        status: 200,
        description: "LLP name availability checked successfully",
    })
    checkName(@Query("companyName") companyName: string) {
        return this.llpService.checkName(companyName);
    }

    // STEP 1 — Name Finalization
    @Post("name-finalization")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Finalize LLP name" })
    @ApiBody({ type: NameFinalizationDto })
    @ApiResponse({
        status: 201,
        description: "LLP name finalized successfully",
        type: LlpNameResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: "Invalid request data",
    })
    createName(@Body() dto: NameFinalizationDto, @Req() request: any) {
        const userId = request.userId;
        // const userId="9663dac5-fc86-460c-9793-6f25fff9fcdf"
        return this.llpService.createName(dto, userId);
    }

    @Post("create/partners")
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Create or update multiple LLP partners with documents" })
    @ApiQuery({
        name: "llpId",
        required: true,
        description: "LLP Registration ID",
    })
    @ApiBody({
        description: "Partners data with documents",
        schema: {
            type: "object",
            properties: {
                partners: { type: "string", description: "JSON array of partner objects" },
                // Example for file uploads
                picture_0: { type: "string", format: "binary" },
                identityProof_0: { type: "string", format: "binary" },
                residentialProof_0: { type: "string", format: "binary" },
                panCard_0: { type: "string", format: "binary" },
            },
            required: ["partners"],
        },
    })
    @ApiResponse({ status: 201, description: "Partners saved successfully" })
    async createPartners(
        @Query("llpId") llpId: string,
        @Body("partners") partnersJson: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        if (!llpId) throw new BadRequestException("Invalid LLP ID");

        let partners: CreatePartnerDto[];
        try {
            partners = JSON.parse(partnersJson);
        } catch {
            throw new BadRequestException("Malformed partners JSON");
        }
        partners = partners.map((p) => ({
            ...p,
            removePicture: p.removePicture === true || p.removePicture === 'true',
            removeIdentityProof:
                p.removeIdentityProof === true || p.removeIdentityProof === 'true',
            removeResidentialProof:
                p.removeResidentialProof === true || p.removeResidentialProof === 'true',
            removePanCard: p.removePanCard === true || p.removePanCard === 'true',
        }));

        return this.llpService.createOrUpdatePartners(partners, files, llpId);
    }


    @Post("update")
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'residentialProof', maxCount: 1 },
            { name: 'noc', maxCount: 1 },
        ])
    )
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Create or update LLP details" })
    @ApiQuery({ name: "llpId", required: true, description: "LLP Registration ID" })
    @ApiBody({
        description: "LLP details with files",
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "llp@example.com" },
                mobileNumber1: { type: "string", example: "9876543210" },
                mobileNumber2: { type: "string", example: "9123456789" },
                address: { type: "string", example: "123, Connaught Place, New Delhi" },
                durationOfStay: { type: "number", example: 3 },
                residentialProof: { type: "string", format: "binary" },
                noc: { type: "string", format: "binary" },

            },
            // required: ["email", "mobileNumber1", "address", "durationOfStay"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "LLP details updated successfully",
        type: UpdateLlpResponseDto,
    })
    @ApiResponse({ status: 400, description: "LLP ID missing or invalid data" })
    async createOrUpdateLLP(
        @Query("llpId") llpId: string,
        @Body() dto: UpdateLlpInfoDto,
        // @UploadedFiles() files: Express.Multer.File[],
        @UploadedFiles()
        files: {
            residentialProof?: Express.Multer.File[];
            noc?: Express.Multer.File[];
        }

    ) {
        if (!llpId) {
            throw new BadRequestException("LLP ID is required");
        }

        // const filesMap: Record<string, Express.Multer.File> = {};
        // for (const file of files ?? []) {
        //     if (!filesMap[file.fieldname]) filesMap[file.fieldname] = file;
        // }

        return this.llpService.createOrUpdateLLP(llpId, dto, {
            residentialProof: files?.residentialProof?.[0],
            noc: files?.noc?.[0],
        });
    }


    @Post(":llpId/esign")
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "subscriberSheet", maxCount: 1 },
            { name: "form9", maxCount: 20 },
        ])
    )
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiOperation({
        summary: "Upload eSign documents (Subscriber Sheet & Form-9)",
        description:
            "Uploads subscriber sheet and/or Form-9 documents for LLP eSign process. Supports metadata mapping for Form-9 partner association.",
    })
    @ApiParam({
        name: "llpId",
        description: "LLP Registration ID",
        required: true,
        example: "77de4dcd-1790-4d47-9241-174d88989ab8",
    })
    @ApiBody({
        description: "eSign documents and metadata",
        schema: {
            type: "object",
            properties: {
                subscriberSheet: {
                    type: "string",
                    format: "binary",
                    description: "Subscriber Sheet PDF (single file)",
                },
                form9: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary",
                    },
                    description: "Form-9 PDFs (multiple files, max 20)",
                },
                metadata: {
                    type: "string",
                    description:
                        "JSON string mapping form9 files to partner IDs",
                    example: JSON.stringify({
                        form9_0: { partnerId: "partner-uuid-1", type: "form9" },
                        form9_1: { partnerId: "partner-uuid-2", type: "form9" },
                    }),
                },
            },
            required: [],
        },
    })
    @ApiResponse({
        status: 200,
        description: "eSign documents uploaded successfully",
        schema: {
            example: {
                message: "eSign documents uploaded successfully",
            },
        },
    })
    @ApiResponse({
        status: 400,
        description:
            "Invalid LLP ID, missing files, invalid metadata, or invalid partnerId",
    })
    uploadEsign(
        @Param("llpId") llpId: string,
        @UploadedFiles()
        files: {
            subscriberSheet?: Express.Multer.File[];
            form9?: Express.Multer.File[];
        },
        @Body("metadata") metadataRaw: string
    ) {
        let metadata: Record<string, { partnerId: string; type: "form9" }>;
        try {
            metadata = JSON.parse(metadataRaw || "{}");
        } catch (error) {
            throw new BadRequestException("Invalid metadata format");
        }
        return this.llpService.uploadEsign(llpId, files, metadata);
    }


    @Get("my")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Get LLPs of logged-in user",
        description:
            "Fetches all LLP registrations associated with the authenticated user.",
    })
    @ApiResponse({
        status: 200,
        description: "List of LLPs fetched successfully",
        schema: {
            example: [
                {
                    id: "77de4dcd-1790-4d47-9241-174d88989ab8",
                    companyName: "ABC LLP",
                    status: "IN_PROGRESS",
                    createdAt: "2025-01-10T08:30:00.000Z",
                    partners: [
                        {
                            id: "12ac745f-1e1b-4a8e-8f85-46d3eae51abd",
                            name: "John Doe",
                            email: "john@example.com",
                        },
                    ],
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized – user not authenticated",
    })
    @ApiResponse({
        status: 404,
        description: "No LLPs found for the user",
    })
    getMyLlps(@Req() req: any) {
        const userId = req.userId;
        // const userId = "9663dac5-fc86-460c-9793-6f25fff9fcdf"
        return this.llpService.getLlpsByUserId(userId);
    }



}
