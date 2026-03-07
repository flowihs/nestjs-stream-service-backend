import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SessionService } from "./session.service";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { SessionResolver } from "@/src/modules/auth/session/session.resolver";
import { VerificationService } from "@/src/modules/verification/verification.service";

@Module({
	imports: [ConfigModule],
	providers: [
		PrismaService,
		SessionService,
		SessionResolver,
		VerificationService
	],
	exports: [SessionService]
})
export class SessionModule {}
