import OpenAI from "openai";
import logger from "./logger";

interface NewsletterPropsResult {
	subject: string;
	summary: string;
}

class SatiricTechAgent {
	private client: OpenAI;

	constructor() {
		this.client = new OpenAI({
			baseURL: "https://api.deepseek.com",
			apiKey: process.env.DEEPSEEK_API_KEY,
		});
	}

	async generateNewsletterProps(
		articleTitles: string[]
	): Promise<NewsletterPropsResult> {
		// Create the prompt
		const articlesText = articleTitles
			.map((title) => `- ${title}`)
			.join("\n");

		const prompt = `You are a satirical tech newsletter writer for SatiricTech. Given these article titles, create a witty subject line and summary in the style of tech satire.

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
			const response = await this.client.chat.completions.create({
				model: "deepseek-chat",
				messages: [{ role: "user", content: prompt }],
				max_tokens: 200,
				temperature: 0.8,
				response_format: {
					type: "json_object",
				},
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
}

export const ai_agent = new SatiricTechAgent();
