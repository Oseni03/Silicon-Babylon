"use client"

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const Disclaimer = () => {
	const [isVisible, setIsVisible] = useState(false);
	const disclaimerRef = useRef<HTMLDivElement>(null);

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

		if (disclaimerRef.current) {
			observer.observe(disclaimerRef.current);
		}

		return () => {
			if (disclaimerRef.current) {
				observer.unobserve(disclaimerRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={disclaimerRef}
			className={cn(
				"container mx-auto px-6 py-12 animate-on-scroll fade-in",
				isVisible && "active"
			)}
		>
			<div className="w-full max-w-4xl mx-auto bg-secondary/50 border border-border rounded-lg p-6 md:p-8">
				<div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
					<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
							<line x1="12" y1="9" x2="12" y2="13"></line>
							<line x1="12" y1="17" x2="12.01" y2="17"></line>
						</svg>
					</div>
					<div>
						<h3 className="text-xl font-medium">
							Important Disclaimer
						</h3>
						<p className="mt-2 text-muted-foreground">
							This content is created for entertainment purposes
							and may include fictional or exaggerated elements.
							Please do not interpret it as factual or serious
							reporting.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Disclaimer;
