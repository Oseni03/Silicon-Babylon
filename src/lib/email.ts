import { Resend } from "resend";
import BulkByteNewsletter from "@/components/BulkByteNewsletter";
import { NewsletterSubscriber, type Article } from "@/types/types";
import { siteName } from "./config";
import { createIssue } from "./db";
import { render } from "@react-email/components";

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
				const body = BulkByteNewsletter({
					articles,
					email: user.email,
					issueNumber: issueNumber.toString(),
					summary,
				});

				await createIssue({
					body: await render(body),
					subject,
					summary,
				});

				return {
					from: `${siteName} <newsletter@satiric-tech.info>`,
					to: user.email,
					subject: `${subject} - ${siteName} Newsletter`,
					react: body,
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
