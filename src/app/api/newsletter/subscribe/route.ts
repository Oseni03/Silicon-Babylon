import { NextResponse } from "next/server";
import { subscribeToNewsletter, isEmailSubscribed } from "@/lib/db";

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email address" },
				{ status: 400 }
			);
		}

		const alreadySubscribed = await isEmailSubscribed(email);
		if (alreadySubscribed) {
			return NextResponse.json(
				{ error: "Email already subscribed" },
				{ status: 400 }
			);
		}

		await subscribeToNewsletter(email);
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to subscribe" },
			{ status: 500 }
		);
	}
}
