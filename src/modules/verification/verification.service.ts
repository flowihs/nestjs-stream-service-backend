import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import type { Request } from "express";

import { TokenType, User } from "@/generated";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { MailService } from "@/src/modules/libs/mail/mail.service";
import { VerificationInput } from "@/src/modules/verification/inputs/verification.input";
import { generateToken } from "@/src/shared/utils/generate-token.util";
import { getSessionMetadata } from "@/src/shared/utils/session-metabase.util";
import { saveSession } from "@/src/shared/utils/session.util";

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input;

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			},
			include: {
				user: true
			}
		});

		if (!existingToken) {
			throw new NotFoundException("Токен не найден");
		}

		if (!existingToken.user) {
			throw new NotFoundException("Пользователь не найден");
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id
				}
			});
			throw new BadRequestException("Токен истек");
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.user.id
			},
			data: {
				isEmailVerified: true
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		});

		const metadata = getSessionMetadata(req, userAgent);

		return saveSession(req, user, metadata);
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY,
			true
		);

		await this.mailService.sendVerificationToken(
			user.email,
			verificationToken.token
		);

		return true;
	}
}
