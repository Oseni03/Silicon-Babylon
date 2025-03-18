import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";
	const redirectTo = `${origin}${next}`;

	if (code) {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		try {
			const { error } = await supabase.auth.exchangeCodeForSession(code);
			if (!error) {
				return NextResponse.redirect(redirectTo);
			}
			console.error("Auth error:", error);
			return NextResponse.redirect(`${origin}/auth/error`);
		} catch (error) {
			console.error("Exchange error:", error);
			return NextResponse.redirect(`${origin}/auth/error`);
		}
	}

	// Return to home page if no code is present
	return NextResponse.redirect(redirectTo);
}
