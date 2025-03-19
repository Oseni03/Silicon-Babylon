"use server";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export async function upsertUser({
	id,
	email,
	username,
}: {
	id: string;
	email: string;
	username?: string;
}) {
	logger.info("Upserting user", { userId: id, email });
	try {
		const user = await prisma.user.upsert({
			where: { id },
			update: {
				email,
				username,
			},
			create: {
				id,
				email,
				username,
			},
		});
		logger.info("User upserted successfully", { userId: id });
		return user;
	} catch (error) {
		logger.error("Failed to upsert user", { error, userId: id });
		throw error;
	}
}

export async function getUserById(id: string) {
	logger.debug("Fetching user by ID", { userId: id });
	try {
		const user = await prisma.user.findUnique({
			where: { id },
		});
		logger.debug("User fetch result", { userId: id, found: !!user });
		return user;
	} catch (error) {
		logger.error("Failed to fetch user", { error, userId: id });
		throw error;
	}
}
