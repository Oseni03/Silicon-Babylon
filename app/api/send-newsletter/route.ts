import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type Article } from "@/types/types";
import { siteUrl } from "@/lib/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
	try {
		// Get the most recent articles from the past week
		const articles: Article[] = await prisma.article.findMany({
			where: {
				createdAt: {
					gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			include: { categories: true },
		});

		// Get all subscribers
		const subscribers = await prisma.newsletter.findMany();

		// Format the newsletter HTML
		const newsletterHtml = `
            <h1>This Week's Top Tech Stories</h1>
            ${articles
				.map(
					(article) => `
                <div>
                    <h2><a href="${siteUrl}/article/${article.slug}">${
						article.title
					}</a></h2>
                    ${article.content.substring(0, 100)}
                </div>
            `
				)
				.join("")}
            <hr/>
            <div>
                <h3>Featured Affiliate Programs</h3>
                <!-- Add your affiliate content here -->
            </div>
        `;

		// Send to all subscribers
		await Promise.all(
			subscribers.map((subscriber) =>
				resend.emails.send({
					from: "newsletter@yourdomain.com",
					to: subscriber.email,
					subject: "Your Weekly Tech Newsletter",
					html: newsletterHtml,
				})
			)
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Newsletter sending failed:", error);
		return NextResponse.json(
			{ error: "Failed to send newsletter" },
			{ status: 500 }
		);
	}
}
