import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { MailService } from "./mail.service";
import { getMailerConfig } from "@/src/core/config/mailer.config";

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailerConfig,
			inject: [ConfigService]
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
