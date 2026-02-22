import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { User } from "@/generated";

export const Authorized = createParamDecorator(
	(data: keyof User, context: ExecutionContext) => {
		let user: User;

		if (context.getType() === "http") {
			user = context.switchToHttp().getRequest().user;
		} else {
			const ctx = GqlExecutionContext.create(context);
			user = ctx.getContext().req.user;
		}

		return data ? user[data] : user;
	}
);
