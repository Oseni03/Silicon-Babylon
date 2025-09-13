import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { processFeeds } from "@/inngest/functions/process-feeds";
import { sendNewsletter } from "@/inngest/functions/newsletter";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		/* your functions will be passed here later! */
		processFeeds,
		sendNewsletter,
	],
});
