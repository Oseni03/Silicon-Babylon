"use server";

import { createClientForServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import logger from "../logger";
import { siteUrl } from "../config";

export async function signInWithGoogle(redirectTo?: string) {
	const supabase = await createClientForServer();
	const callbackUrl = new URL("/auth/callback", siteUrl);
	callbackUrl.searchParams.set("next", redirectTo || "/");

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: callbackUrl.toString(),
		},
	});

	if (error) {
		throw new Error("Authentication failed");
	}

	logger.info("Sign in with Google", { data });

	redirect(data.url);
}
