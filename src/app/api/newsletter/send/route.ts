import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterBatch } from "@/lib/email";
import { getTopArticles } from "@/lib/db";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 60; // Increase to 5 minutes

export async function POST(request: Request) {
	try {
		// Get all active subscribers
		const subscribers = await prisma.newsletter.findMany({
			where: {
				// verified: true,
				unsubscribed: false,
			},
		});

		if (subscribers.length === 0) {
			return NextResponse.json({
				success: true,
				message: "No active subscribers found",
				sent: 0
			});
		}

		// Get top articles for newsletter
		const articles = await getTopArticles();

		// Send newsletter batch
		const result = await sendNewsletterBatch(
			subscribers.map(s => s.email),
			articles
		);

		if (result.success) {
			// Update last email sent timestamp for all subscribers
			await prisma.newsletter.updateMany({
				where: {
					id: {
						in: subscribers.map(s => s.id)
					}
				},
				data: {
					lastEmailSent: new Date()
				}
			});
		}

		return NextResponse.json({
			success: result.success,
			sent: result.sent,
			message: result.success ? "Newsletter batch sent successfully" : "Failed to send newsletter batch",
			error: result.error
		});
	} catch (error) {
		logger.error("Newsletter sending failed:", error);
		return NextResponse.json(
			{ 
				success: false,
				error: "Failed to send newsletters",
				details: error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
