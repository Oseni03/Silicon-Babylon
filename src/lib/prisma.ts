// /c:/Users/USER/Documents/projects/silicon-babylon/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
	console.warn(
		"WARNING: DATABASE_URL is not set. Prisma will fail if it tries to connect to the database."
	);
	console.warn(
		"Please ensure you have a .env file with DATABASE_URL set."
	);
}

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: ["warn", "error"],
	}).$extends({
		query: {
			$allOperations({ query, args }) {
				return query(args);
			},
		},
	});
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
