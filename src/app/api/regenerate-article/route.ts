import { NextResponse } from "next/server";
import slugify from "@sindresorhus/slugify";
import { prisma } from "@/lib/prisma";
import { OpenAI } from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const BATCH_SIZE = 3; // Tune this for your OpenAI rate limits and server resources

export async function GET(request: Request) {
	try {
		// Get all articles with their original content
		const articles = await prisma.article.findMany({
			select: {
				id: true,
				originalTitle: true,
				originalUrl: true,
				categories: {
					select: { name: true },
				},
			},
		});
		let updatedCount = 0;
		let failedCount = 0;

		// Helper to process a single article
		async function processArticle(article: any) {
			try {
				const completion = await openai.chat.completions.create({
					model: "gpt-4",
					messages: [
						{
							role: "system",
							content: `You are a witty and sarcastic tech journalist. You will create mythical versions of tech news articles.\nAlways respond with valid JSON that matches this format exactly:{\n  \"title\": \"The SEO optimized funny title\",\n  \"content\": \"The SEO optimized mythical/funny content in HTML format (exactly 1500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)\",\n  \"description\": \"The short SEO optimized and captivating meta description without HTML formatting\",\n  \"keywords\": [\"keyword1\", \"keyword2\", \"keyword3\", \"keyword4\", \"keyword5\", ...]\n}`,
						},
						{
							role: "user",
							content: `Create a mythical version of this tech news article using humor techniques such as exaggeration, irony, parody, or absurdism. Make it funny and entertaining while keeping it relevant to the original topic. Avoid offensive content. Format the content in HTML, with paragraphs wrapped in <p> tags and other HTML elements (e.g., <strong>, <em>, <ul>, <li>) as needed. The content MUST be exactly 1500 words.\n\nOriginal Title: ${article.originalTitle}\nCategories: ${article.categories.map((c: any) => c.name).join(", ")}\nOriginal URL: ${article.originalUrl}\n\nRespond with ONLY valid JSON as specified in the system message.`,
						},
					],
					temperature: 1,
					response_format: { type: "json_object" },
				});

				const response = JSON.parse(
					completion.choices[0].message.content || "{}"
				);
				if (!response.title || !response.content)
					throw new Error("Invalid response format from OpenAI");

				let newSlug = slugify(response.title);
				let counter = 1;
				// Handle duplicate slugs
				while (
					await prisma.article.findFirst({
						where: {
							AND: [
								{ slug: newSlug },
								{ id: { not: article.id } },
							],
						},
					})
				) {
					newSlug = `${slugify(response.title)}-${counter}`;
					counter++;
				}

				await prisma.article.update({
					where: { id: article.id },
					data: {
						title: response.title,
						content: response.content,
						description: response.description || "",
						keywords: Array.isArray(response.keywords)
							? response.keywords
							: ["myth", "tech", "humor"],
						slug: newSlug,
						updatedAt: new Date(),
					},
				});
				updatedCount++;
			} catch (error) {
				console.error(`Error processing article ${article.id}:`, error);
				failedCount++;
			}
		}

		// Batch processing for speed
		for (let i = 0; i < articles.length; i += BATCH_SIZE) {
			const batch = articles.slice(i, i + BATCH_SIZE);
			await Promise.all(batch.map(processArticle));
			// Optional: delay between batches to avoid OpenAI rate limits
			if (i + BATCH_SIZE < articles.length) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		}

		return NextResponse.json({
			success: true,
			message: `Successfully updated ${updatedCount} articles. Failed: ${failedCount}`,
		});
	} catch (error) {
		console.error("Error regenerating articles:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to regenerate articles" },
			{ status: 500 }
		);
	}
}
