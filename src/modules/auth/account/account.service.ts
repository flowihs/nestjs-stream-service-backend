import {
	ConflictException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { hash } from "argon2";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { CreateUserInput } from "@/src/modules/auth/account/inputs/create-user.input";
import { VerificationService } from "@/src/modules/verification/verification.service";

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			}
		});

		if (!user) {
			throw new NotFoundException("Пользователь не найден");
		}

		return user;
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input;

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		});

		if (isUsernameExists) {
			throw new ConflictException("Имя этого пользователя уже занято");
		}

		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		});

		if (isEmailExists) {
			throw new ConflictException("Почта этого пользователя уже занято");
		}

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username
			}
		});

		await this.verificationService.sendVerificationToken(user);

		return true;
	}
}
