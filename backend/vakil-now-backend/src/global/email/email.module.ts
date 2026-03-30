import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { SesClientProvider } from './email.provider';


@Global()
@Module({
  imports: [ConfigModule],
  providers: [EmailService, SesClientProvider],
  exports: [EmailService],
})
export class EmailModule { }
