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
	const retryDelay = 5000; // Increased to 5 seconds base delay

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			// Add initial delay to prevent rate limiting
			if (attempt > 1) {
				// Exponential backoff: 5s, 10s, 15s
				await new Promise((resolve) =>
					setTimeout(resolve, retryDelay * attempt)
				);
			}

			const url = `${siteUrl}/article/${slug}`;
			const { mainTweet, replyText } = formatTweet(title, excerpt);

			// Post main tweet
			const mainTweetResponse = await client.readWrite.v2.tweet(
				mainTweet
			);

			// Add delay between tweets
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Post reply with the link
			await client.readWrite.v2.reply(
				`${replyText}\n${url}`,
				mainTweetResponse.data.id
			);

			logger.info("Successfully posted tweet thread", { title, slug });
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
					headers: error?.headers,
					rateLimit: error?.rateLimit,
				},
				attempt,
				articleTitle: title,
				slug,
			});

			if (isForbiddenError) {
				logger.error(
					"Twitter API Forbidden error - check app permissions and tokens",
					{
						error: error?.error,
					}
				);
				// Don't retry on 403 errors
				return;
			}

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
 * @returns Formatted tweet string.
 */
function formatTweet(
	title: string,
	excerpt: string
): { mainTweet: string; replyText: string } {
	const instruction = "\n\nCheck out the full article in the comments! 👇";
	const baseLength = title.length + instruction.length;
	let contentSlice = excerpt;

	// Truncate content if needed (280 character limit)
	if (baseLength + excerpt.length > 280) {
		const allowedContentLength = 280 - baseLength - 4; // -4 for ellipsis
		contentSlice = excerpt.slice(0, allowedContentLength) + "...";
	}

	return {
		mainTweet: `${title}\n\n${contentSlice}${instruction}`,
		replyText: "Read the full article here:",
	};
}
