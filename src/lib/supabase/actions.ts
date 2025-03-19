"use server";

import { createClientForServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import logger from "../logger";
import { siteUrl } from "../config";

export async function signInWithGoogle(redirectTo?: string) {
	const supabase = await createClientForServer();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${siteUrl}/auth/callback`,
		},
	});

	if (error) {
		throw new Error("Authentication failed");
	}

	if (redirectTo) {
		redirect(redirectTo);
	}

	logger.info("Sign in with Google", { data });

	redirect(data.url);
}
