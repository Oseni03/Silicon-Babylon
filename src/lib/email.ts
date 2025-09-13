import { Resend } from "resend";
import BulkByteNewsletter from "@/components/BulkByteNewsletter";
import { NewsletterSubscriber, type Article } from "@/types/types";
import { siteName } from "./config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletterBatch({
	users,
	articles,
	issueNumber,
	subject,
	summary,
}: {
	users: NewsletterSubscriber[];
	articles: Article[];
	issueNumber: number;
	subject: string;
	summary: string;
}) {
	try {
		const batch = await Promise.all(
			users.map(async (user) => {
				return {
					from: `${siteName} <newsletter@satiric-tech.info>`,
					to: user.email,
					subject: `${subject} - ${siteName} Newsletter`,
					react: BulkByteNewsletter({
						articles,
						email: user.email,
						issueNumber: issueNumber.toString(),
						summary,
					}),
				};
			})
		);

		const data = await resend.batch.send(batch);

		return {
			success: true,
			data,
			sent: users.length,
		};
	} catch (error) {
		console.error("Failed to send newsletter batch:", error);
		return {
			success: false,
			error,
			sent: 0,
		};
	}
}
