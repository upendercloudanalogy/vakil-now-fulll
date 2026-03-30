import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { ConfigService } from '@nestjs/config';
import { SES_CLIENT } from './email.provider';
import { EmailTemplate } from './email.template';
import { EmailOptions } from './interfaces/email-options.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly senderEmail: string;

  constructor(
    @Inject(SES_CLIENT) private readonly sesClient: SESv2Client,
    private readonly configService: ConfigService,
  ) {
    this.senderEmail = this.configService.get<string>('TESTING_SES_SENDER_EMAIL')!;
  }

  async sendEmail(options: EmailOptions) {
    const { to, subject, body, from } = options;

    const command = new SendEmailCommand({
      FromEmailAddress: from || this.senderEmail, // fallback to default
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: body }, // ✅ prefer HTML since templates use markup
          },
        },
      },
    });

    try {
      const result = await this.sesClient.send(command);
      this.logger.log(`✅ Email sent to ${to} (${subject}) [MessageId: ${result.MessageId}]`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const subject = `Welcome to VakilNow, ${name}! 🎉`;
    const body = EmailTemplate.getWelcomeTemplate(name);
    return this.sendEmail({ to, subject, body, from: this.senderEmail });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${this.configService.get<string>('APP_BASE_URL')}/auth/verifyEmailLink?token=${token}&email=${encodeURIComponent(to)}`;
    const subject = 'Verify your VakilNow email address';
    const body = EmailTemplate.getVerificationTemplate(verifyUrl);
    
    
    return this.sendEmail({ to, subject, body, from: this.senderEmail });
  }
}
