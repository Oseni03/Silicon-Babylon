import { NextResponse } from "next/server";
import { createClientForServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(
	request: Request,
	context: { params: { id: string } }
) {
	const { id: commentId } = await context.params;

	try {
		const supabase = await createClientForServer();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { content } = await request.json();
		const reply = await prisma.commentReply.create({
			data: {
				content,
				commentId,
				userId: user.id,
			},
			include: {
				user: true,
			},
		});

		return NextResponse.json(reply);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
