import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		if (!request) {
			throw new UnauthorizedException("Пользователь не авторизован");
		}

		if (!request.session || !request.session.userId) {
			throw new UnauthorizedException("Пользователь не авторизован");
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: request.session.userId }
		});

		if (!user) {
			throw new UnauthorizedException("Пользователь не авторизован");
		}

		request.user = user;

		return true;
	}
}
