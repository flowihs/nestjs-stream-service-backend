import {
	ConflictException,
	Injectable,
} from "@nestjs/common";
import { hash } from "argon2";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { CreateUserInput } from "@/src/modules/auth/account/inputs/create-user.input";

@Injectable()
export class AccountService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		const users = this.prismaService.user.findMany();

		return users;
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

		await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username
			}
		});

		return true;
	}
}
