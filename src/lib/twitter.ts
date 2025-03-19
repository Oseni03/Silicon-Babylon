import logger from "./logger";
import { siteUrl } from "./config";
import crypto from "crypto";

// Twitter API v2 endpoint
const TWITTER_API_URL = "https://api.twitter.com/2/tweets";

function generateOAuthSignature(
	method: string,
	url: string,
	params: Record<string, string>
) {
	const oauthParams = {
		oauth_consumer_key: process.env.TWITTER_API_KEY!,
		oauth_token: process.env.TWITTER_ACCESS_TOKEN!,
		oauth_signature_method: "HMAC-SHA1",
		oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
		oauth_nonce: crypto.randomBytes(16).toString("base64"),
		oauth_version: "1.0",
	};

	// Combine all parameters
	const allParams = { ...params, ...oauthParams };

	// Create signature base string
	const paramString = Object.keys(allParams)
		.sort()
		.map(
			(key) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(
					allParams[key]
				)}`
		)
		.join("&");

	const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(
		url
	)}&${encodeURIComponent(paramString)}`;

	// Create signing key
	const signingKey = `${encodeURIComponent(
		process.env.TWITTER_API_SECRET!
	)}&${encodeURIComponent(process.env.TWITTER_ACCESS_SECRET!)}`;

	// Generate signature
	const signature = crypto
		.createHmac("sha1", signingKey)
		.update(signatureBaseString)
		.digest("base64");

	oauthParams.oauth_signature = signature;

	// Create Authorization header
	return (
		"OAuth " +
		Object.keys(oauthParams)
			.map(
				(key) =>
					`${encodeURIComponent(key)}="${encodeURIComponent(
						oauthParams[key]
					)}"`
			)
			.join(", ")
	);
}

// Replace getAuthHeader with proper OAuth signature generation
function getAuthHeader(): string {
	return generateOAuthSignature("POST", TWITTER_API_URL, {});
}

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
	const retryDelay = 1000;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const url = `${siteUrl}/article/${slug}`;
			const tweet = formatTweet(title, excerpt, url);

			const response = await fetch(TWITTER_API_URL, {
				method: "POST",
				headers: {
					Authorization: getAuthHeader(),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: tweet }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw {
					code: response.status,
					error: error,
				};
			}

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
