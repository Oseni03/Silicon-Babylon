import { createCategory } from "@/lib/db";
import logger from "@/lib/logger";
import { generateSlug } from "@/lib/utils";
import { Category, SatiricalResult } from "@/types/types";
import OpenAI from "openai";
import Parser from "rss-parser";

const parser = new Parser();
const openai = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function fetchFeed(feedUrl: string) {
	try {
		const feed = await parser.parseURL(feedUrl);
		return feed;
	} catch (error) {
		logger.warn(`Failed to fetch feed: ${feedUrl}`, { error });
		return null;
	}
}

export async function ensureCategories(
	categories: string[]
): Promise<Category[]> {
	logger.debug("Ensuring categories exist", { categories });
	const categoryObjects = [];

	for (const category of categories) {
		const slug = generateSlug(category);
		const categoryObject = await createCategory({ name: category, slug });
		categoryObjects.push(categoryObject);
	}

	return categoryObjects;
}

export async function generateSatiricalVersion(
	originalTitle: string,
	originalContent: string
): Promise<SatiricalResult | null> {
	try {
		logger.info("Generating satirical version", { originalTitle });
		// System prompt to instruct the model about JSON formatting
		const systemPrompt = `You are a witty and sarcastic tech journalist. You will create satirical versions of tech news articles.
	Always respond with valid JSON that matches this format exactly:
	{
	  "title": "The SEO optimized funny title",
	  "content": "The SEO optimized satirical/funny content in HTML format (around 1500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)",
	  "description": "The short SEO optimized and captivating meta description in without HTML formatting",
	  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", ...]
	}`;

		// User prompt with the specific article context
		const userPrompt = `Create a satirical version of this tech news article using humor techniques such as exaggeration, irony, parody, or absurdism. Make it funny and entertaining while keeping it relevant to the original topic. Avoid offensive content. Format the content in HTML, with paragraphs wrapped in <p> tags and other HTML elements (e.g., <strong>, <em>, <ul>, <li>) as needed.

	Original Title: ${originalTitle}
	Original Content: ${originalContent}...

	Respond with ONLY valid JSON in this exact format:
	{
	"title": "The SEO optimized satirical/funny title",
	"content": "The SEO optimized satirical/funny content in HTML format (around 1500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)",
	"description": "The SEO optimized, captivating meta description that interests people to read the full article",
	"keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", ...]
	}

	The keywords should be SEO-optimized terms related to the article that would help with search engine ranking.`;

		const completion = await openai.chat.completions.create({
			model: "deepseek-chat",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			temperature: 1.5,
			max_tokens: 2500,
			response_format: {
				type: "json_object",
			},
		});

		const responseText = completion.choices[0].message.content || "{}";
		let response;

		try {
			const sanitizedResponse = responseText
				.replace(/[\n\r]/g, "\\n")
				.replace(/[\t]/g, "\\t")
				.replace(/\u0000-\u001F/g, "");

			response = JSON.parse(sanitizedResponse);
		} catch (jsonError) {
			try {
				response = JSON.parse(responseText.trim());
			} catch {
				logger.error("Error parsing Deepseek JSON response", {
					error: jsonError,
					responseText,
				});
				console.error(
					"Error parsing Deepseek JSON response:",
					jsonError
				);
				console.log("Raw response:", responseText);
				return null;
			}
		}

		if (!response.title || !response.content) {
			logger.error("Invalid response format", { response });
			return null;
		}

		return {
			title: response.title,
			content: response.content,
			description: response.description || "",
			keywords:
				Array.isArray(response.keywords) && response.keywords.length > 0
					? response.keywords
					: ["satire", "tech", "humor"],
		};
	} catch (error) {
		logger.error("Error generating satirical version", {
			error,
			originalTitle,
		});
		console.error("Error generating satirical version:", error);
		return null;
	}
}

export async function generateNewsletterSummary(titles: string[]) {
	const sample =
		"We've got AI having midlife crises, startups pivoting to pet rocks, and the usual crypto shenanigans. Let's dive into this week's digital chaos!";
}
