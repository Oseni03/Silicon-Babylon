import fetch from "node-fetch";
import logger from "./logger";
import { siteUrl } from "./config";

const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN!;
const GROUP_ID = process.env.FACEBOOK_GROUP_ID!;

/**
 * Posts article content to Facebook group and adds article link as a comment
 */
export async function postToFacebook(
	title: string,
	slug: string,
	content: string
): Promise<void> {
	try {
		const articleUrl = `${siteUrl}/article/${slug}`;
		const mainMessage = formatMainPost(title, content);
		const postId = await createGroupPost(mainMessage);

		if (postId) {
			// Wait briefly before commenting to ensure post is processed
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await addArticleComment(postId, articleUrl);
			logger.info("Successfully posted to Facebook", { title, slug });
		}
	} catch (error) {
		logger.error("Failed to post to Facebook", { error, title, slug });
		throw error;
	}
}

async function createGroupPost(message: string): Promise<string | null> {
	const url = `https://graph.facebook.com/${GROUP_ID}/feed`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message,
				access_token: ACCESS_TOKEN,
			}),
		});

		const data = await response.json();
		if ("error" in data) {
			logger.error("Facebook API error", { error: data.error });
			return null;
		}

		return data.id;
	} catch (error) {
		logger.error("Failed to create Facebook post", { error });
		return null;
	}
}

async function addArticleComment(
	postId: string,
	articleUrl: string
): Promise<void> {
	const url = `https://graph.facebook.com/${postId}/comments`;
	const commentMessage = `Read the full article here: ${articleUrl}`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: commentMessage,
				access_token: ACCESS_TOKEN,
			}),
		});

		const data = await response.json();
		if ("error" in data) {
			logger.error("Facebook comment API error", { error: data.error });
		}
	} catch (error) {
		logger.error("Failed to add Facebook comment", { error });
	}
}

function formatMainPost(title: string, content: string): string {
	const excerpt = content.replace(/<[^>]*>/g, "").substring(0, 300);
	return `🔥 *${title}*\n\n${excerpt}...\n\nCheck the comments for the full article link! 👇`;
}
