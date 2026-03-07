import { Module } from "@nestjs/common";

import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { VerificationService } from "@/src/modules/verification/verification.service";

@Module({
	providers: [
		AccountResolver,
		AccountService,
		PrismaService,
		VerificationService
	]
})
export class AccountModule {}
