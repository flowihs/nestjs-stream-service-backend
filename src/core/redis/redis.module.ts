import { Global, Module } from "@nestjs/common";

import { RedisService } from "./redis.service";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
	providers: [RedisService],
	exports: [RedisService]
})
export class RedisModule extends Redis {
	public constructor(private readonly configService: ConfigService) {
		super(configService.getOrThrow<string>('REDIS_URI'));
	}
}
