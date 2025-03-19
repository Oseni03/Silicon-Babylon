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

		const like = await prisma.commentLike.create({
			data: {
				commentId,
				userId: user.id,
			},
		});

		return NextResponse.json(like);
	} catch (error) {
		if (error.code === "P2002") {
			return new NextResponse("Already liked", { status: 400 });
		}
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function DELETE(
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

		await prisma.commentLike.delete({
			where: {
				commentId_userId: {
					commentId,
					userId: user.id,
				},
			},
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
