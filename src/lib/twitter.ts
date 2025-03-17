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
	const maxRetries = 3;
	const retryDelay = 1000; // 1 second

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const url = `${siteUrl}/article/${slug}`;
			const tweet = formatTweet(title, excerpt, url);

			await client.v2.tweet(tweet);
			logger.info("Successfully posted tweet", { title, slug });
			return;
		} catch (error: any) {
			const isRateLimitError = error?.code === 429;
			const isForbiddenError = error?.code === 403;
			const isOAuthError = error?.error?.type?.includes("oauth");

			// Log detailed error information
			logger.error("Twitter API error details", {
				error: {
					code: error?.code,
					type: error?.error?.type,
					detail: error?.error?.detail,
					title: error?.error?.title,
				},
				attempt,
				articleTitle: title,
				slug,
			});

			// If it's an OAuth error, don't retry
			if (isOAuthError) {
				logger.error(
					"Twitter OAuth configuration error - check app permissions in Twitter Developer Portal",
					{
						error: error?.error?.detail,
					}
				);
				return;
			}

			if (
				attempt === maxRetries ||
				(!isRateLimitError && !isForbiddenError)
			) {
				logger.error("Final error posting tweet", {
					error,
					title,
					slug,
					attempt,
				});
				return;
			}

			logger.warn(`Tweet attempt ${attempt} failed, retrying...`, {
				error,
				title,
				slug,
			});

			await new Promise((resolve) =>
				setTimeout(resolve, retryDelay * attempt)
			);
		}
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
