import { MailerOptions } from "@nestjs-modules/mailer";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

import { isDev } from "../../shared/utils/is-dev.util";

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>("MAIL_HOST"),
			port: configService.getOrThrow<number>("MAIL_PORT"),
			secure: false,
			auth: {
				user: configService.getOrThrow<string>("MAIL_LOGIN"),
				pass: configService.getOrThrow<string>("MAIL_PASSWORD"),
			},
			defaults: {
				from: `"Stream" ${configService.getOrThrow<string>("MAIL_LOGIN")}`,
			}
		}
	};
}
