import { NextResponse } from "next/server";
import slugify from "@sindresorhus/slugify";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		// Get all articles
		const articles = await prisma.article.findMany({
			select: {
				id: true,
				title: true,
			},
		});

		let updatedCount = 0;

		// Process articles sequentially to handle duplicate slugs
		for (const article of articles) {
			let newSlug = slugify(article.title);
			let counter = 1;

			// Check if slug exists (excluding the current article) and append number if needed
			while (
				await prisma.article.findFirst({
					where: {
						AND: [{ slug: newSlug }, { id: { not: article.id } }],
					},
				})
			) {
				newSlug = `${slugify(article.title)}-${counter}`;
				counter++;
			}

			await prisma.article.update({
				where: { id: article.id },
				data: {
					slug: newSlug,
					updatedAt: new Date(),
				},
			});

			updatedCount++;
		}

		return NextResponse.json({
			success: true,
			message: `Successfully updated slugs for ${updatedCount} articles`,
		});
	} catch (error) {
		console.error("Error regenerating slugs:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to regenerate slugs" },
			{ status: 500 }
		);
	}
}
