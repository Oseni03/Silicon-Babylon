import { siteName } from "../config";
import logger from "../logger";

interface LinkedInError {
	status: number;
	message: string;
	response?: any;
}

export async function postToLinkedIn(
	articleTitle: string,
	articleUrl: string,
	content: string,
	categories: string[],
	accessToken: string,
	urn: string
): Promise<void> {
	if (!accessToken || !urn) {
		throw new Error("LinkedIn credentials not properly configured");
	}

	const defaultHashtags = [siteName, "tech", "news", "TechNews"];
	const hashtags = [...defaultHashtags, ...categories]
		.map((cat) => `#${cat.replace(/[^a-zA-Z0-9]/g, "")}`)
		.join(" ");

	const postUrl = "https://api.linkedin.com/v2/ugcPosts";
	const postBody = {
		author: urn,
		lifecycleState: "PUBLISHED",
		specificContent: {
			"com.linkedin.ugc.ShareContent": {
				shareCommentary: {
					text: `${articleTitle}\n\n${content}\n\nRead full story: ${articleUrl}\n\n${hashtags}`,
				},
				shareMediaCategory: "ARTICLE",
				media: [{ status: "READY", originalUrl: articleUrl }],
			},
		},
		visibility: {
			"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
		},
	};

	try {
		const response = await fetch(postUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postBody),
		});

		if (!response.ok) {
			const responseText = await response.text();
			let responseData;
			try {
				responseData = JSON.parse(responseText);
			} catch {
				responseData = responseText;
			}

			const error: LinkedInError = {
				status: response.status,
				message: response.statusText,
				response: responseData,
			};

			logger.error("LinkedIn API error", error);
			throw new Error(
				`LinkedIn API error: ${response.status} ${response.statusText}`
			);
		}

		logger.info("Successfully posted to LinkedIn", { articleTitle });
	} catch (error) {
		logger.error("Failed to post to LinkedIn", { error, articleTitle });
		throw error;
	}
}
