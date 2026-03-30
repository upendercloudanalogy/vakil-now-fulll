import { ConfigService } from '@nestjs/config';
// import { SESClient } from '@aws-sdk/client-ses';
import { Provider } from '@nestjs/common';
import { SESv2Client  } from '@aws-sdk/client-sesv2';

export const SES_CLIENT = 'SES_CLIENT';

export const SesClientProvider: Provider = {
  provide: SES_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const region = configService.get<string>('TEST_AWS_REGION');
    const accessKeyId = configService.get<string>('TESTING_EMAIL_AWS_ACCESS_KEY');
    const secretAccessKey = configService.get<string>('TESTING_EMAIL_SECRET_KEY') ||'';

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS SES configuration values');
    }
 
    return new SESv2Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  },
  inject: [ConfigService],
};
