import { NextResponse } from "next/server";
import { fetchAndProcessFeeds } from "@/lib/feedProcessor";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 300; // Increase to 5 minutes

export async function GET(request: Request) {
	try {
		// Warm up the connection pool
		await prisma.$connect();

		logger.info("Starting feed processing from API route");
		await fetchAndProcessFeeds();

		return NextResponse.json(
			{ message: "Feed processing completed successfully" },
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error in process-feed API route", { error });
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	} finally {
		// Cleanup connections
		await prisma.$disconnect();
	}
}
