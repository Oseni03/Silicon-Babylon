import { NextResponse } from "next/server";
import { createClientForServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const supabase = await createClientForServer();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { type } = await request.json();
		const articleId = params.id;

		const reaction = await prisma.articleReaction.upsert({
			where: {
				articleId_userId: {
					articleId,
					userId: user.id,
				},
			},
			update: {
				type,
			},
			create: {
				type,
				articleId,
				userId: user.id,
			},
		});

		return NextResponse.json(reaction);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const reactions = await prisma.articleReaction.groupBy({
			by: ["type"],
			where: {
				articleId: params.id,
			},
			_count: {
				type: true,
			},
		});

		const counts = reactions.reduce((acc, curr) => {
			acc[curr.type] = curr._count.type;
			return acc;
		}, {} as Record<string, number>);

		return NextResponse.json(counts);
	} catch (error) {
		return new NextResponse("Internal Error", { status: 500 });
	}
}
