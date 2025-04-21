// /c:/Users/USER/Documents/projects/satirical-techscape/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: ["warn", "error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
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
