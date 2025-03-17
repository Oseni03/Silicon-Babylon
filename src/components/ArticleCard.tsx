import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ArticleCardProps } from "@/types/types";

const ArticleCard = ({
	title,
	excerpt,
	date,
	category,
	index,
	slug,
	isAffiliate,
	originalUrl,
}: ArticleCardProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1,
			}
		);

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
			}
		};
	}, []);

	const formattedDate = new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<div
			ref={cardRef}
			className={cn(
				"group relative border border-border rounded-lg overflow-hidden transition-all duration-500 ease-out bg-card hover:shadow-md",
				"animate-on-scroll fade-in",
				isVisible && "active",
				"transition-all duration-500 ease-out",
				`animation-delay-${Math.min(index * 100, 600)}`,
				isAffiliate && "border-primary/20"
			)}
		>
			<div className="p-6 space-y-4">
				<div className="flex items-center justify-between mb-3">
					<span
						className={cn(
							"text-xs font-medium px-2.5 py-0.5 rounded-full",
							isAffiliate
								? "bg-primary/10 text-primary"
								: "bg-secondary text-secondary-foreground"
						)}
					>
						{category}
					</span>
					<span className="text-xs text-muted-foreground">
						{formattedDate}
					</span>
				</div>

				<h3 className="text-xl font-medium leading-tight group-hover:text-primary/90 transition-colors">
					{title}
				</h3>

				<div
					className="text-muted-foreground text-sm line-clamp-4"
					dangerouslySetInnerHTML={{
						__html: excerpt,
					}}
				/>

				<div className="pt-2">
					{isAffiliate ? (
						<a
							href={originalUrl}
							target="_blank"
							rel="noopener noreferrer sponsored"
							className="inline-flex items-center text-sm font-medium text-primary"
						>
							Learn more
							<svg
								className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="5" y1="12" x2="19" y2="12" />
								<polyline points="12 5 19 12 12 19" />
							</svg>
						</a>
					) : (
						<Link
							href={`/article/${slug}`}
							className="inline-flex items-center text-sm font-medium text-primary"
						>
							Read more
							<svg
								className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="5" y1="12" x2="19" y2="12" />
								<polyline points="12 5 19 12 12 19" />
							</svg>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default ArticleCard;
