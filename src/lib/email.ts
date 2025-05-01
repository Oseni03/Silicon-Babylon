import { Resend } from "resend";
import BulkByteNewsletter from "@/components/BulkByteNewsletter";
import { type Article } from "@/types/types";
import { siteName } from "./config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletterBatch(emails: string[], articles: Article[]) {
	try {
		const batch = emails.map(email => ({
			from: "satiric-tech.info",
			to: email,
			subject: `${siteName} Newsletter - ${new Date().toLocaleDateString()}`,
			react: BulkByteNewsletter(articles, email),
		}));

		const data = await resend.batch.send(batch);

		return { 
			success: true, 
			data,
			sent: emails.length
		};
	} catch (error) {
		console.error("Failed to send newsletter batch:", error);
		return { 
			success: false, 
			error,
			sent: 0
		};
	}
}
