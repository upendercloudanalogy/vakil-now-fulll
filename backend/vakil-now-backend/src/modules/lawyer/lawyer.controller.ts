import { Body, Controller, Get, Post, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { LawyerService } from "./lawyer.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Public } from "../auth/decorators/public.decorator";


@Controller("lawyer")
export class LawyerController {
    constructor(private readonly lawyerService: LawyerService) { }


    @Post("onboarding/identity")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'governmentId', maxCount: 1 },
        { name: 'barCouncilId', maxCount: 1 },
    ]))
    async saveIdentity (
        @Body() body: any,
        @UploadedFiles() files: { profilePhoto?: any[], governmentId?: any[], barCouncilId?: any[] },
        @Req() req:any
    ) {
        return this.lawyerService.saveIdentity(body, files,req);
    }


    @Post("onboarding/professional")
    async saveProfessionalStructure (@Body() body: any, @Req() req: any) {
        // Step 2 mein files nahi hain, isliye no interceptor
        return this.lawyerService.saveProfessionalStructure(body, req);
    }


    @Post("onboarding/expertise")
    async saveExpertise (@Body() body: any, @Req() req: any) {
        return this.lawyerService.saveExpertise(body, req);
    }


    @Post("onboarding/feedback")
    async saveFeedback (@Body() body: any, @Req() req: any) {
        return this.lawyerService.saveFeedback(body, req);
    }

    @Get("onboarding/data")
    async getOnboardingData(@Req() req:any){
        return this.lawyerService.getFullLawyerOnboardingData(req);
    }

}