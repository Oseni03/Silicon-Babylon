"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import AuthModal from "@/components/AuthModal";
import {
	getComments,
	getReactionCounts,
	addReaction,
	addComment,
	toggleCommentLike,
	addReply,
} from "@/lib/db/articleInteractions";

interface ArticleInteractionsProps {
	articleId: string;
}

const REACTIONS = [
	{ type: "LIKE", emoji: "👍" },
	{ type: "LOVE", emoji: "❤️" },
	{ type: "LAUGH", emoji: "😂" },
	{ type: "SAD", emoji: "😢" },
	{ type: "ANGRY", emoji: "😠" },
] as const;

export default function ArticleInteractions({
	articleId,
}: ArticleInteractionsProps) {
	const { user } = useAuth();
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(false);
	const [reactionCounts, setReactionCounts] = useState<
		Record<string, number>
	>({});
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [replyContent, setReplyContent] = useState("");
	const [replyLoading, setReplyLoading] = useState(false);
	const { trigger, showAuthModal, setShowAuthModal } = useProtectedAction();

	const fetchComments = async () => {
		const data = await getComments(articleId);
		setComments(data);
	};

	const fetchReactionCounts = async () => {
		const data = await getReactionCounts(articleId);
		setReactionCounts(data);
	};

	const handleReaction = async (type: string) => {
		trigger(async () => {
			try {
				if (!user?.id) return;
				await addReaction(articleId, type, user.id);
				await fetchReactionCounts();
			} catch (error) {
				console.error("Error adding reaction:", error);
			}
		});
	};

	const handleComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !user?.id) return;

		trigger(async () => {
			setLoading(true);
			try {
				await addComment(articleId, newComment, user.id);
				setNewComment("");
				await fetchComments();
			} catch (error) {
				console.error("Error adding comment:", error);
			} finally {
				setLoading(false);
			}
		});
	};

	const handleLike = async (commentId: string) => {
		trigger(async () => {
			try {
				if (!user?.id) return;
				await toggleCommentLike(commentId, user.id);
				await fetchComments();
			} catch (error) {
				console.error("Error liking comment:", error);
			}
		});
	};

	const handleReply = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!replyContent.trim() || !replyingTo || !user?.id) return;

		trigger(async () => {
			setReplyLoading(true);
			try {
				await addReply(replyingTo, replyContent, user.id);
				setReplyContent("");
				setReplyingTo(null);
				await fetchComments();
			} catch (error) {
				console.error("Error adding reply:", error);
			} finally {
				setReplyLoading(false);
			}
		});
	};

	useEffect(() => {
		fetchComments();
		fetchReactionCounts();
	}, [articleId]);

	return (
		<div className="mt-8 space-y-6">
			<div className="flex gap-2 mb-4">
				<TooltipProvider>
					{REACTIONS.map(({ type, emoji }) => (
						<Tooltip key={type}>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handleReaction(type)}
									className="h-10 w-10 text-lg relative"
								>
									{emoji}
									{reactionCounts[type] > 0 && (
										<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{reactionCounts[type]}
										</span>
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{type.charAt(0) +
										type.slice(1).toLowerCase()}
								</p>
							</TooltipContent>
						</Tooltip>
					))}
				</TooltipProvider>
			</div>

			<div className="space-y-4">
				<h3 className="text-xl font-bold">Comments</h3>

				<form onSubmit={handleComment} className="space-y-4">
					<Textarea
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Add a comment..."
						className="min-h-[100px]"
					/>
					<Button
						type="submit"
						disabled={loading || !user}
						className="w-full sm:w-auto"
					>
						{loading ? "Posting..." : "Post Comment"}
					</Button>
				</form>

				{comments.length === 0 ? (
					<div className="text-center p-8 border rounded-md text-muted-foreground">
						<p>
							No comments yet. Be the first to share your
							thoughts!
						</p>
					</div>
				) : comments.length > 2 ? (
					<ScrollArea className="h-[400px] w-full rounded-md border p-4">
						<div className="space-y-4">
							{comments.map((comment: any) => (
								<Card key={comment.id}>
									<CardContent className="p-4">
										<div className="flex items-start gap-4">
											<Avatar>
												<AvatarFallback>
													{comment.user.username?.charAt(
														0
													) || "U"}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-semibold">
														{comment.user
															.username ||
															"Anonymous"}
													</span>
													<span className="text-sm text-muted-foreground">
														{formatDate(
															comment.createdAt
														)}
													</span>
												</div>
												<p className="mt-2 text-sm text-foreground">
													{comment.content}
												</p>
												<div className="mt-2 flex items-center gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleLike(
																comment.id
															)
														}
														className={`text-muted-foreground ${
															comment.likes.some(
																(like: any) =>
																	like.userId ===
																	user?.id
															)
																? "text-primary"
																: ""
														}`}
													>
														👍{" "}
														{comment.likes.length}
													</Button>
													<Dialog>
														<DialogTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	setReplyingTo(
																		comment.id
																	)
																}
																className="text-muted-foreground"
															>
																💬{" "}
																{
																	comment
																		.replies
																		.length
																}
															</Button>
														</DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>
																	Reply to
																	comment
																</DialogTitle>
															</DialogHeader>
															<form
																onSubmit={
																	handleReply
																}
																className="space-y-4"
															>
																<Textarea
																	value={
																		replyContent
																	}
																	onChange={(
																		e
																	) =>
																		setReplyContent(
																			e
																				.target
																				.value
																		)
																	}
																	placeholder="Write your reply..."
																	className="min-h-[100px]"
																/>
																<Button
																	type="submit"
																	disabled={
																		replyLoading ||
																		!user
																	}
																>
																	{replyLoading
																		? "Posting..."
																		: "Post Reply"}
																</Button>
															</form>
														</DialogContent>
													</Dialog>
												</div>
												{comment.replies.length > 0 && (
													<div className="mt-4 space-y-3 pl-4 border-l">
														{comment.replies.map(
															(reply: any) => (
																<div
																	key={
																		reply.id
																	}
																	className="flex gap-2"
																>
																	<Avatar className="h-6 w-6">
																		<AvatarFallback className="text-xs">
																			{reply.user.username?.charAt(
																				0
																			) ||
																				"U"}
																		</AvatarFallback>
																	</Avatar>
																	<div>
																		<div className="flex items-center gap-2">
																			<span className="font-semibold text-sm">
																				{reply
																					.user
																					.username ||
																					"Anonymous"}
																			</span>
																			<span className="text-xs text-muted-foreground">
																				{formatDate(
																					reply.createdAt
																				)}
																			</span>
																		</div>
																		<p className="text-sm">
																			{
																				reply.content
																			}
																		</p>
																	</div>
																</div>
															)
														)}
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</ScrollArea>
				) : (
					<div className="space-y-4 w-full rounded-md border p-4">
						{comments.map((comment: any) => (
							<Card key={comment.id}>
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<Avatar>
											<AvatarFallback>
												{comment.user.username?.charAt(
													0
												) || "U"}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<span className="font-semibold">
													{comment.user.username ||
														"Anonymous"}
												</span>
												<span className="text-sm text-muted-foreground">
													{formatDate(
														comment.createdAt
													)}
												</span>
											</div>
											<p className="mt-2 text-sm text-foreground">
												{comment.content}
											</p>
											<div className="mt-2 flex items-center gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleLike(comment.id)
													}
													className={`text-muted-foreground ${
														comment.likes.some(
															(like: any) =>
																like.userId ===
																user?.id
														)
															? "text-primary"
															: ""
													}`}
												>
													👍 {comment.likes.length}
												</Button>
												<Dialog>
													<DialogTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																setReplyingTo(
																	comment.id
																)
															}
															className="text-muted-foreground"
														>
															💬{" "}
															{
																comment.replies
																	.length
															}
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>
																Reply to comment
															</DialogTitle>
														</DialogHeader>
														<form
															onSubmit={
																handleReply
															}
															className="space-y-4"
														>
															<Textarea
																value={
																	replyContent
																}
																onChange={(e) =>
																	setReplyContent(
																		e.target
																			.value
																	)
																}
																placeholder="Write your reply..."
																className="min-h-[100px]"
															/>
															<Button
																type="submit"
																disabled={
																	replyLoading ||
																	!user
																}
															>
																{replyLoading
																	? "Posting..."
																	: "Post Reply"}
															</Button>
														</form>
													</DialogContent>
												</Dialog>
											</div>
											{comment.replies.length > 0 && (
												<div className="mt-4 space-y-3 pl-4 border-l">
													{comment.replies.map(
														(reply: any) => (
															<div
																key={reply.id}
																className="flex gap-2"
															>
																<Avatar className="h-6 w-6">
																	<AvatarFallback className="text-xs">
																		{reply.user.username?.charAt(
																			0
																		) ||
																			"U"}
																	</AvatarFallback>
																</Avatar>
																<div>
																	<div className="flex items-center gap-2">
																		<span className="font-semibold text-sm">
																			{reply
																				.user
																				.username ||
																				"Anonymous"}
																		</span>
																		<span className="text-xs text-muted-foreground">
																			{formatDate(
																				reply.createdAt
																			)}
																		</span>
																	</div>
																	<p className="text-sm">
																		{
																			reply.content
																		}
																	</p>
																</div>
															</div>
														)
													)}
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</div>
	);
}
