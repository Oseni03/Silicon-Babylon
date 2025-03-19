import { NextRequest, NextResponse } from "next/server";
import { createClientForServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id: articleId } = await params;

	try {
		const supabase = await createClientForServer();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { content } = await request.json();

		const comment = await prisma.comment.create({
			data: {
				content,
				articleId,
				userId: user.id,
			},
			include: {
				user: true,
			},
		});

		return NextResponse.json(comment);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id: articleId } = await params;

	try {
		const comments = await prisma.comment.findMany({
			where: {
				articleId,
			},
			include: {
				user: true,
				likes: true,
				replies: {
					include: {
						user: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(comments);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
