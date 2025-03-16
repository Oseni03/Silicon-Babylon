import { TwitterApi } from "twitter-api-v2";
import logger from "./logger";
import { siteUrl } from "./config";

// Initialize Twitter client
const client = new TwitterApi({
	appKey: process.env.TWITTER_API_KEY!,
	appSecret: process.env.TWITTER_API_SECRET!,
	accessToken: process.env.TWITTER_ACCESS_TOKEN!,
	accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

/**
 * Posts a tweet with the article title, excerpt, and URL.
 * @param title - The title of the article.
 * @param slug - The slug of the article for the URL.
 * @param excerpt - A short excerpt from the article.
 */
export async function postTweet(
	title: string,
	slug: string,
	excerpt: string
): Promise<void> {
	try {
		const url = `${siteUrl}/article/${slug}`;
		const tweet = formatTweet(title, excerpt, url);

		// Post the tweet
		await client.v2.tweet(tweet);
		logger.info("Successfully posted tweet", { title, slug });
	} catch (error) {
		logger.error("Error posting tweet", { error, title, slug });
		throw error; // Re-throw the error for further handling if needed
	}
}

/**
 * Formats the tweet with the title, excerpt, and URL.
 * Ensures the tweet does not exceed 280 characters.
 * @param title - The title of the article.
 * @param excerpt - A short excerpt from the article.
 * @param url - The URL of the article.
 * @returns Formatted tweet string.
 */
function formatTweet(title: string, excerpt: string, url: string): string {
	const maxTweetLength = 280;
	const urlLength = url.length + 1; // +1 for the newline
	const maxContentLength = maxTweetLength - urlLength;

	// Combine title and excerpt
	let content = `${title}\n\n${excerpt}`;

	// Truncate content if it exceeds the maximum length
	if (content.length > maxContentLength) {
		const truncationIndicator = "...";
		const maxTruncatedLength =
			maxContentLength - truncationIndicator.length;
		content = `${content.substring(
			0,
			maxTruncatedLength
		)}${truncationIndicator}`;
	}

	// Add the URL
	return `${content}\n${url}`;
}
