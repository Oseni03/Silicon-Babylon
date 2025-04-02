import { siteName } from "../config";

export interface BlobResponse {
	blob: {
		$type: string;
		ref: { $link: string };
		mimeType: string;
		size: number;
	};
}

export interface SessionResponse {
	did: string;
	handle: string;
	email?: string;
	accessJwt: string;
	refreshJwt: string;
}

export interface UrlSpan {
	start: number;
	end: number;
	url: string;
}

function generateOgImageUrl(title: string, siteUrl: string): string {
	return `${siteUrl}/api/og?title=${encodeURIComponent(
		title
	)}&width=1200&height=630`;
}

async function uploadBlob(
	imageUrl: string,
	accessToken: string
): Promise<BlobResponse["blob"]> {
	const imageResponse = await fetch(imageUrl);
	if (!imageResponse.ok) throw new Error("Failed to fetch image");

	const blobResponse = await fetch(
		"https://bsky.social/xrpc/com.atproto.repo.uploadBlob",
		{
			method: "POST",
			headers: {
				"Content-Type": "image/png",
				Authorization: `Bearer ${accessToken}`,
			},
			body: await imageResponse.arrayBuffer(),
		}
	);

	if (!blobResponse.ok) throw new Error("Failed to upload blob");
	return ((await blobResponse.json()) as BlobResponse).blob;
}

async function createExternalEmbed(
	url: string,
	title: string,
	description: string,
	accessToken: string
) {
	const siteUrl = new URL(url).origin;
	const ogImageUrl = generateOgImageUrl(title, siteUrl);

	const thumb = await uploadBlob(ogImageUrl, accessToken);

	return {
		$type: "app.bsky.embed.external",
		external: {
			uri: url,
			title,
			description,
			thumb,
		},
	};
}

export async function createSession(): Promise<SessionResponse> {
	const resp = await fetch(
		"https://bsky.social/xrpc/com.atproto.server.createSession",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				identifier: process.env.BLUESKY_USERNAME,
				password: process.env.BLUESKY_PASSWORD,
			}),
		}
	);

	if (!resp.ok)
		throw new Error(`Failed to create session: ${resp.statusText}`);
	return (await resp.json()) as SessionResponse;
}

async function parseUrls(text: string): Promise<UrlSpan[]> {
	const spans: UrlSpan[] = [];
	const urlRegex =
		/[$|\W](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*[-a-zA-Z0-9@%_\+~#//=])?)/g;

	const textEncoder = new TextEncoder();
	const textBytes = textEncoder.encode(text);

	let match;
	while ((match = urlRegex.exec(text)) !== null) {
		const url = match[1];
		const startByte = textEncoder.encode(
			text.slice(0, match.index + 1)
		).length;
		const endByte = startByte + textEncoder.encode(url).length;

		spans.push({
			start: startByte,
			end: endByte,
			url: url,
		});
	}
	return spans;
}

async function parseFacets(text: string): Promise<
	Array<{
		index: { byteStart: number; byteEnd: number };
		features: Array<{ $type: string; uri: string }>;
	}>
> {
	const facets = [];

	const urls = await parseUrls(text);
	for (const u of urls) {
		facets.push({
			index: {
				byteStart: u.start,
				byteEnd: u.end,
			},
			features: [
				{
					$type: "app.bsky.richtext.facet#link",
					uri: u.url,
				},
			],
		});
	}

	return facets;
}

export async function postToBluesky(
	title: string,
	description: string,
	link: string,
	categories: string[],
	session: SessionResponse
): Promise<void> {
	try {
		const defaultHashtags = [siteName, "tech", "news", "TechNews"];
		const hashtags = [...defaultHashtags, ...categories]
			.map((cat) => `#${cat.replace(/[^a-zA-Z0-9]/g, "")}`)
			.join(" ");

		const text = `${title}\n\n${description}\n\n${link}\n\n${hashtags}`;
		const facets = await parseFacets(text);

		// Create embed
		const embed = await createExternalEmbed(
			link,
			title,
			description,
			session.accessJwt
		);

		const post = {
			$type: "app.bsky.feed.post",
			text: text,
			facets: facets,
			embed: embed,
			createdAt: new Date().toISOString(),
		};

		const response = await fetch(
			"https://bsky.social/xrpc/com.atproto.repo.createRecord",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.accessJwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					repo: session.did,
					collection: "app.bsky.feed.post",
					record: post,
				}),
			}
		);

		if (!response.ok)
			throw new Error(`Failed to create post: ${response.statusText}`);

		console.log("Successfully posted to Bluesky!", { title });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		console.error("Error posting to Bluesky:", errorMessage);
		throw error;
	}
}
