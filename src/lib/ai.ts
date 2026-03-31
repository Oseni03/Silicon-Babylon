import OpenAI from "openai";
import logger from "./logger";
import { SatiricalResult } from "@/types/types";

interface NewsletterPropsResult {
	subject: string;
	summary: string;
}

class SiliconBabylonAgent {
	private client: OpenAI;

	constructor() {
		this.client = new OpenAI({
			baseURL: "https://api.deepseek.com",
			apiKey: process.env.DEEPSEEK_API_KEY,
		});
	}

	async run({
		messages,
		max_tokens,
		temperature,
	}: {
		messages: any[];
		max_tokens: number;
		temperature: number;
	}) {
		const response = await this.client.chat.completions.create({
			model: "deepseek-chat",
			messages,
			max_tokens,
			temperature,
			response_format: {
				type: "json_object",
			},
		});
		return response;
	}

	async generateNewsletterProps(
		articleTitles: string[]
	): Promise<NewsletterPropsResult> {
		// Create the prompt
		const articlesText = articleTitles
			.map((title) => `- ${title}`)
			.join("\n");

		const prompt = `You are a satirical tech newsletter writer for Silicon Babylon. Given these article titles, create a witty subject line and summary in the style of tech satire.

Article titles:
${articlesText}

Generate a newsletter introduction with:
1. A satirical subject line
2. A humorous summary in the style: "We've got AI having midlife crises, startups pivoting to pet rocks, and the usual crypto shenanigans. Let's dive into this week's digital chaos!"

Make it funny, sarcastic, and capture the absurdity of tech culture. Keep the summary to 1-2 sentences.

Respond ONLY with valid JSON in this exact format:
{
    "subject": "your subject line here",
    "summary": "your summary here"
}

DO NOT include any text outside the JSON.`;

		try {
			const response = await this.run({
				messages: [{ role: "user", content: prompt }],
				max_tokens: 200,
				temperature: 0.8,
			});

			// Parse the response
			let content = response.choices[0].message.content || "";

			// Clean up any markdown formatting
			content = content
				.replace(/```json/g, "")
				.replace(/```/g, "")
				.trim();

			const result = JSON.parse(content) as NewsletterPropsResult;

			return {
				subject: result.subject,
				summary: result.summary,
			};
		} catch (error) {
			// if (error instanceof SyntaxError) {
			// 	// JSON parsing error - fallback
			// 	return {
			// 		subject: "This Week in Tech: AI-Generated Chaos",
			// 		summary:
			// 			"We've got AI-generated content, startups burning cash, and the usual tech shenanigans. Let's decode this digital disaster!",
			// 	};
			// }

			// API or other errors
			logger.error("Error generating newsletter props:", error);
			throw new Error("Failed to generate newsletter props");
		}
	}

	async generateSatiricalVersion(
		originalTitle: string,
		originalContent: string
	): Promise<SatiricalResult | null> {
		try {
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

			const completion = await this.run({
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userPrompt },
				],
				max_tokens: 2500,
				temperature: 1.5,
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
					Array.isArray(response.keywords) &&
					response.keywords.length > 0
						? response.keywords
						: ["satire", "tech", "humor"],
			};
		} catch (error) {
			logger.error("Error in generateSatiricalVersion:", error);
			return null;
		}
	}
}

export const ai_agent = new SiliconBabylonAgent();
