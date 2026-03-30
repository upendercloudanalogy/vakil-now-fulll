import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    constructor(private configService: ConfigService) { }
    async sendOtp(phonenumber: string, otp: string): Promise<void> {
        try {

            const apiKey = this.configService.get<string>('SMS_API_KEY');
            const senderId = this.configService.get<string>('SMS_SENDER');
            const entityId = this.configService.get<string>('SMS_ENTITY_ID');
            const dltTemplateId = this.configService.get<string>('SMS_DLTTEMPLATE_ID');

            if (!apiKey || !senderId) {
                throw new InternalServerErrorException('SMS credentials not configured');
            }

            const msg = `Your one-time OTP is ${otp} for verifying your mobile number on Vakilnow. This OTP is valid for 10 minutes. Please sign up at https://info.vakil-now.com.`;
            const encodedMsg = encodeURIComponent(msg);
            const url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${apiKey}&senderid=${senderId}&channel=2&DCS=0&flashsms=0&number=${phonenumber}&text=${encodedMsg}&route=1&EntityId=${entityId}&dlttemplateid=${dltTemplateId}`;

            const response = await axios.post(url, null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000,
            });

            if (response.data.ErrorCode === '000') {
                this.logger.log(`SMS sent successfully to ${phonenumber}`);
            } else {
                throw new InternalServerErrorException(`SMS Gateway Error: ${response.data.ErrorMessage}`);
            }
        } catch (error) {
            this.logger.error(` SMS failed: ${error.message}`);
            throw new InternalServerErrorException(`Failed to send OTP: ${error.message}`);
        }
    }

    async sendPhoneOtp(phone: string, otp: string): Promise<void> {
        await this.sendOtp(phone, otp);
        this.logger.log(`OTP ${otp} sent successfully to ${phone}`);
    }
}