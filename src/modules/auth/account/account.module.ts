import { Module } from "@nestjs/common";

import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";
import { PrismaService } from "@/src/core/prisma/prisma.service";

@Module({
	providers: [AccountResolver, AccountService, PrismaService]
})
export class AccountModule {}
