import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AccountService } from "./account.service";
import { CreateUserInput } from "@/src/modules/auth/account/inputs/create-user.input";
import { UserModel } from "@/src/modules/auth/account/models/user.model";

@Resolver("Account")
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: "findAllUsers" })
	public async findAll() {
		return this.accountService.findAll();
	}

	@Mutation(() => Boolean, { name: "createUser" })
	public async create(@Args("data") input: CreateUserInput) {
		return this.accountService.create(input);
	}
}
