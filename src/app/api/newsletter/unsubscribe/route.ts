import { NextResponse } from "next/server";
import { unsubscribeToNewsletter } from "@/lib/db";

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email address" },
				{ status: 400 }
			);
		}

		await unsubscribeToNewsletter(email);
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to unsubscribe" },
			{ status: 500 }
		);
	}
}
