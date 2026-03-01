import DeviceDetector from "device-detector-js";
import { Request } from "express";
import { lookup } from "geoip-lite";
import * as countries from "i18n-iso-countries";

import type { SessionMetadata } from "@/src/shared/types/session-metadata.types";
import { IS_DEV_ENV } from "@/src/shared/utils/is-dev.util";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	const ip = IS_DEV_ENV
		? "173.166.164.121"
		: Array.isArray(req.headers["cf-connecting-ip"])
			? req.headers["cf-connecting-ip"][0]
			: req.headers["cf-connecting-ip"] ||
				(typeof req.headers["x-forwarded-for"] === "string"
					? req.headers["x-forwarded-for"].split(",")[0]
					: req.ip || "");

	const device = new DeviceDetector().parse(userAgent);
	const location = lookup(ip);

	const safeIp = ip || "Unknown";

	return {
		location: {
			// @ts-ignore
			country: countries.getName(location.country, "en") || "Неизвестно",
			city: location?.city || "Неизвестно",
			latitude: location?.ll?.[0] || 0,
			longitude: location?.ll?.[1] || 0
		},
		device: {
			browser: device?.client?.name || "Unknown",
			os: device?.os?.name || "Unknown",
			type: device?.device?.type || "Unknown"
		},
		ip: safeIp
	};
}
