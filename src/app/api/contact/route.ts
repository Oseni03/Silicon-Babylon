import { createContactMessage } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		await createContactMessage({
			name,
			email,
			subject,
			message,
		});

		return NextResponse.json(
			{ message: "Contact message sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error sending contact message:", error);
		return NextResponse.json(
			{ error: "Failed to send contact message" },
			{ status: 500 }
		);
	}
}
