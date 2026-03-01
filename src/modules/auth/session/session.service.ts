import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verify } from "argon2";
import { Request } from "express";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { RedisService } from "@/src/core/redis/redis.service";
import { LoginInput } from "@/src/modules/auth/session/inputs/login.input";
import { getSessionMetadata } from "@/src/shared/utils/session-metabase.util";

@Injectable()
export class SessionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService
	) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId;

		const keys = await this.redisService.keys("*");

		if (!keys || !Array.isArray(keys)) {
			return [];
		}

		const userSessions: any = [];

		for (const key of keys) {
			const sessionData = await this.redisService.get(key);

			if (sessionData) {
				const session: any = JSON.parse(sessionData);

				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(":")[1]
					});
				}
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt);

		return userSessions.filter(session => session.id !== req.session.id);
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password } = input;

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{
						username: { equals: login }
					},
					{
						email: { equals: login }
					}
				]
			}
		});

		if (!user) {
			throw new NotFoundException("Пользователь не найден");
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new UnauthorizedException("Неверный пароль");
		}

		const metadata = getSessionMetadata(req, userAgent);

		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date();
			req.session.userId = user.id;
			req.session.metadata = metadata;

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							"Не удалось сохранить сессию"
						)
					);
				}

				resolve(user);
			});
		});
	}

	public async findCurrent(req: Request) {
		const sessionId = req.session.id;

		const sessionData: any = await this.redisService.get(
			`${this.configService.getOrThrow<string>("SESSION_FOLDER")}${sessionId}`
		);

		const session = JSON.parse(sessionData);

		return {
			...session,
			id: sessionId
		};
	}

	public async logout(req: Request) {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							"Не удалось завершить сессию"
						)
					);
				}

				req.res?.clearCookie(
					this.configService.getOrThrow<string>("SESSION_NAME")
				);

				resolve(true);
			});
		});
	}

	public async clearSession(req: Request) {
		req.res?.clearCookie(
			this.configService.getOrThrow<string>("SESSION_NAME")
		);

		return true;
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException("Текущую сессию удалить нельзя");
		}

		await this.redisService.del(
			`${this.configService.getOrThrow<string>("SESSION_FOLDER")}${id}`
		);

		return true;
	}
}
