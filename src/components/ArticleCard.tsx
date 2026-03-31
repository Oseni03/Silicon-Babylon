"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ArticleCardProps } from "@/types/types";
import AnimatedSection from "@/components/AnimatedSection";

const ArticleCard = ({
	title,
	excerpt,
	date,
	categories = [],
	index,
	slug,
	isAffiliate = false,
	originalUrl,
	image,
	imageAlt = title,
}: ArticleCardProps) => {
	const formattedDate = new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const linkHref = isAffiliate ? originalUrl : `/article/${slug}`;
	const LinkComponent = isAffiliate ? "a" : Link;
	const linkProps = isAffiliate ? { target: "_blank", rel: "noopener noreferrer sponsored" } : {};

	return (
		<AnimatedSection
			direction="up"
			distance={20}
			delay={Math.min(index * 0.1, 0.6)}
			className={cn(
				"group flex flex-col h-full border-b border-foreground pb-8 md:pb-12 transition-all",
				isAffiliate && "bg-primary/5 p-6 md:p-8"
			)}
		>
			<LinkComponent href={linkHref as any} {...linkProps} className="flex flex-col h-full gap-6">
				{image && (
					<div className="relative aspect-[16/10] overflow-hidden bg-muted transition-all duration-500 grayscale hover:grayscale-0">
						<Image
							src={image}
							alt={imageAlt}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							priority={index < 3}
						/>
					</div>
				)}

				<div className="flex flex-col flex-grow space-y-4">
					<div className="flex items-center gap-3">
						<div className="flex gap-2">
							{categories.length > 0 ? (
								categories.slice(0, 1).map((cat) => (
									<span key={cat.slug} className="text-[10px] uppercase tracking-widest font-bold text-foreground border-b border-foreground">
										{cat.name}
									</span>
								))
							) : (
								<span className="text-[10px] uppercase tracking-widest font-bold text-foreground border-b border-foreground">
									Inside Tech
								</span>
							)}
						</div>
						<span className="text-[10px] uppercase tracking-widest font-bold text-foreground/60">
							{formattedDate}
						</span>
					</div>

					<h3 className="text-2xl md:text-3xl font-serif leading-[1.1] group-hover:underline decoration-1 underline-offset-4 transition-all">
						{title}
					</h3>

					<p 
						className="text-foreground/80 text-sm leading-relaxed line-clamp-3 font-sans"
						dangerouslySetInnerHTML={{ __html: excerpt }}
					/>

					{isAffiliate && (
						<div className="pt-2 text-[10px] uppercase tracking-widest font-black text-primary">
							Sponsored Content
						</div>
					)}
				</div>
			</LinkComponent>
		</AnimatedSection>
	);
};

export default ArticleCard;
