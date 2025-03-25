import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: [
		// Keep static asset exclusions
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
