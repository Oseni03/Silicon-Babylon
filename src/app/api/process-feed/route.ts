import { NextResponse } from "next/server";
import { fetchAndProcessFeeds } from "@/lib/feedProcessor";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		// Process the feeds
		logger.info("Starting feed processing from API request");
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
	}
}
