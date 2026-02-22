import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SessionService } from "./session.service";
import { PrismaService } from "@/src/core/prisma/prisma.service";

@Module({
	imports: [ConfigModule],
	providers: [PrismaService, SessionService],
	exports: [SessionService]
})
export class SessionModule {}
