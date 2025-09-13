import {
	createIssue,
	getActiveSubscribers,
	getIssuesCount,
	getTopArticles,
} from "@/lib/db";
import { inngest } from "../client";
import logger from "@/lib/logger";
import { sendNewsletterBatch } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { Article, NewsletterSubscriber } from "@/types/types";
import { ai_agent } from "@/lib/ai";
import { render } from "@react-email/components";
import BulkByteNewsletter from "@/components/BulkByteNewsletter";

export const sendNewsletter = inngest.createFunction(
	{ id: "send-newsletter" },
	{ cron: "TZ=Europe/Paris 0 6 * * 1" },
	async ({ step }) => {
		// Get all active subscribers
		const subscribers = await getActiveSubscribers();

		if (subscribers?.length === 0) {
			logger.info("No active subscribers found for newsletter");
			return {
				success: true,
				message: "No active subscribers found",
				sent: 0,
			};
		}

		// Get top articles
		const articles = await getTopArticles();

		if (articles?.length === 0) {
			logger.info("No article found for newsletter");
			return {
				success: true,
				message: "No article found",
				sent: 0,
			};
		}

		// Get newsletter props
		const props = await step.run("get-newsletter-props", async () => {
			const issuesCount = await getIssuesCount();
			const newIssueCount = issuesCount + 1;
			const props = await ai_agent.generateNewsletterProps(
				articles.slice(3).map((a) => a.title)
			);
			return {
				...props,
				issueNumber: newIssueCount,
			};
		});

		if (!articles || !subscribers) {
			logger.error("Articles or subscribers not found");
			return {
				success: false,
				message: "Articles or subscribers not found",
				sent: 0,
			};
		}

		// Send newsletter batch
		const result = await step.run("send-newsletter-batch", async () => {
			await createIssue({
				body: await render(
					BulkByteNewsletter({
						articles: articles,
						issueNumber: props.issueNumber.toString(),
						summary: props.summary as string,
					})
				),
				subject: props.subject as string,
				summary: props.summary as string,
			});
			return sendNewsletterBatch({
				users: subscribers as NewsletterSubscriber[],
				articles,
				issueNumber: props.issueNumber as number,
				summary: props.summary as string,
				subject: props.subject as string,
			});
		});

		if (result.success) {
			await step.run("update-last-email-sent", async () => {
				return prisma.newsletter.updateMany({
					where: {
						id: {
							in: subscribers.map((s) => s.id),
						},
					},
					data: {
						lastEmailSent: new Date(),
					},
				});
			});
		}
	}
);
