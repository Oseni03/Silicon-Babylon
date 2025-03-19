import { NextResponse } from "next/server";
import { createClientForServer } from "@/lib/supabase/server";
import logger from "@/lib/logger";
import { upsertUser } from "@/lib/db/users";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") || "/";

	if (code) {
		const supabase = await createClientForServer();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (user) {
					// Create or update user in the database
					await upsertUser({
						id: user.id,
						email: user.email!,
						username: user.user_metadata?.full_name,
					});
				}

				const forwardedHost = request.headers.get("x-forwarded-host");
				const isLocalEnv = process.env.NODE_ENV === "development";
				if (isLocalEnv) {
					return NextResponse.redirect(`${origin}${next}`);
				} else if (forwardedHost) {
					return NextResponse.redirect(
						`https://${forwardedHost}${next}`
					);
				} else {
					return NextResponse.redirect(`${origin}${next}`);
				}
			} catch (dbError) {
				logger.error("Failed to create/update user in database", {
					dbError,
				});
				// Continue the flow even if database update fails
			}
		}
	}

	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
