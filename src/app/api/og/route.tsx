import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteName } from "@/lib/config";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const title = searchParams.get("title");

		if (!title) {
			return new Response("Missing title parameter", { status: 400 });
		}

		// Construct OG image
		return new ImageResponse(
			(
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#ffffff",
						padding: "60px 40px",
						gap: "60px",
					}}
				>
					<div
						style={{
							fontSize: "72px",
							fontWeight: "900",
							fontVariant: "bold",
							color: "#000000",
							textAlign: "center",
							maxWidth: "900px",
							lineHeight: 1.2,
						}}
					>
						{title}
					</div>
					<div
						style={{
							fontSize: "36px",
							color: "#666666",
							padding: "20px",
							borderTop: "3px solid #eaeaea",
							width: "100%",
							textAlign: "center",
							position: "absolute",
							bottom: "60px",
						}}
					>
						{siteName}
					</div>
				</div>
			),
			{
				width: 1000,
				height: 1500,
			}
		);
	} catch (e) {
		console.error(e);
		return new Response("Failed to generate image", { status: 500 });
	}
}
