"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";

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
	const pathname = usePathname();

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
		<div className="mt-12 space-y-12">
			{/* Reactions */}
			<div className="flex flex-wrap gap-3">
				<TooltipProvider>
					{REACTIONS.map(({ type, emoji }) => (
						<Tooltip key={type}>
							<TooltipTrigger asChild>
								<button
									onClick={() => handleReaction(type)}
									className="group relative flex items-center gap-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-all font-sans text-sm font-bold uppercase tracking-widest"
								>
									<span>{emoji}</span>
									{reactionCounts[type] > 0 && (
										<span className="text-[10px]">{reactionCounts[type]}</span>
									)}
								</button>
							</TooltipTrigger>
							<TooltipContent className="rounded-none border-black bg-black text-white px-2 py-1 text-[10px] uppercase tracking-widest">
								<p>{type.charAt(0) + type.slice(1).toLowerCase()}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</TooltipProvider>
			</div>

			{/* Comments Section */}
			<div className="space-y-8">
				<div className="flex items-center justify-between border-b border-black pb-4">
					<h3 className="text-sm uppercase tracking-[0.3em] font-black">Discussion</h3>
					<span className="text-[10px] uppercase font-bold text-muted-foreground">{comments.length} Comments</span>
				</div>

				<form onSubmit={handleComment} className="space-y-4">
					<div className="relative group">
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="JOIN THE CONVERSATION..."
							className="w-full bg-transparent border-b-2 border-black/10 py-4 px-1 text-sm tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-black/20 uppercase font-bold min-h-[80px] resize-none"
						/>
						<div className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-focus-within:w-full transition-all duration-500"></div>
					</div>
					<button
						type="submit"
						disabled={loading}
						onClick={() => !user && setShowAuthModal(true)}
						className="group flex items-center gap-4 py-2 px-1 text-left"
					>
						<span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
							{loading ? "POSTING..." : "SUBMIT COMMENT"}
						</span>
						<div className="w-8 h-px bg-black group-hover:w-16 transition-all duration-500"></div>
					</button>
				</form>

				<div className="space-y-8 divide-y divide-black/10">
					{comments.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
								No comments yet. Be the first to share.
							</p>
						</div>
					) : (
						comments.map((comment: any) => (
							<div key={comment.id} className="pt-8">
								<div className="flex items-start gap-4">
									<Avatar className="rounded-none border border-black h-8 w-8">
										<AvatarFallback className="rounded-none bg-black text-white text-[10px] font-black">
											{comment.user.username?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<span className="text-[10px] uppercase tracking-widest font-black">
													{comment.user.username || "Anonymous"}
												</span>
												<span className="text-[10px] uppercase tracking-widest text-muted-foreground">
													{formatDate(comment.createdAt)}
												</span>
											</div>
										</div>
										<p className="text-sm font-sans leading-relaxed text-black/80">
											{comment.content}
										</p>
										<div className="flex items-center gap-6">
											<button
												onClick={() => handleLike(comment.id)}
												className={cn(
													"text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-black transition-colors",
													comment.likes.some((like: any) => like.userId === user?.id)
														? "text-black"
														: "text-muted-foreground"
												)}
											>
												Like ({comment.likes.length})
											</button>
											<Dialog>
												<DialogTrigger asChild>
													<button
														onClick={() => setReplyingTo(comment.id)}
														className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors"
													>
														Reply ({comment.replies.length})
													</button>
												</DialogTrigger>
												<DialogContent className="rounded-none border-black">
													<DialogHeader>
														<DialogTitle className="text-[10px] uppercase tracking-[0.3em] font-black">
															Reply to {comment.user.username || "Anonymous"}
														</DialogTitle>
													</DialogHeader>
													<form onSubmit={handleReply} className="space-y-6 pt-4">
														<div className="relative group">
															<textarea
																value={replyContent}
																onChange={(e) => setReplyContent(e.target.value)}
																placeholder="WRITE YOUR REPLY..."
																className="w-full bg-transparent border-b-2 border-black/10 py-4 px-1 text-sm tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-black/20 uppercase font-bold min-h-[100px] resize-none"
															/>
															<div className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-focus-within:w-full transition-all duration-500"></div>
														</div>
														<button
															type="submit"
															disabled={replyLoading || !user}
															className="group flex items-center gap-4 py-2 px-1 text-left"
														>
															<span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
																{replyLoading ? "POSTING..." : "POST REPLY"}
															</span>
															<div className="w-8 h-px bg-black group-hover:w-16 transition-all duration-500"></div>
														</button>
													</form>
												</DialogContent>
											</Dialog>
										</div>

										{comment.replies.length > 0 && (
											<div className="mt-6 space-y-6 pl-8 border-l border-black/10">
												{comment.replies.map((reply: any) => (
													<div key={reply.id} className="space-y-2">
														<div className="flex items-center gap-3">
															<span className="text-[10px] uppercase tracking-widest font-black">
																{reply.user.username || "Anonymous"}
															</span>
															<span className="text-[10px] uppercase tracking-widest text-muted-foreground">
																{formatDate(reply.createdAt)}
															</span>
														</div>
														<p className="text-sm font-sans leading-relaxed text-black/70">
															{reply.content}
														</p>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				redirectPath={pathname}
			/>
		</div>
	);
}
