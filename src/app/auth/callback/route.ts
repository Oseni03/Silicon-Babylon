import { NextResponse } from "next/server";
import { createClientForServer } from "@/lib/supabase/server";
import logger from "@/lib/logger";
import { upsertUser } from "@/lib/db/users";
import { siteUrl } from "@/lib/config";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
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
					await upsertUser({
						id: user.id,
						email: user.email!,
						username: user.user_metadata?.full_name,
					});
				}

				const forwardedHost = request.headers.get("x-forwarded-host");
				const forwardedProto = request.headers.get("x-forwarded-proto");

				if (forwardedHost && forwardedProto) {
					return NextResponse.redirect(
						`${forwardedProto}://${forwardedHost}${next}`
					);
				} else {
					return NextResponse.redirect(
						new URL(next, siteUrl).toString()
					);
				}
			} catch (dbError) {
				logger.error("Failed to create/update user in database", {
					dbError,
				});
				// Continue the flow even if database update fails
			}
		}
	}

	return NextResponse.redirect(
		new URL("/auth/auth-code-error", siteUrl).toString()
	);
}
