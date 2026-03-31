"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { siteName } from "@/lib/config";
import { unsubscribeToNewsletter } from "@/lib/db";
import { Loader2 } from "lucide-react";

const CTA = () => {
	const [isVisible, setIsVisible] = useState(true);
	const [isSticky, setIsSticky] = useState(false);
	const ctaRef = useRef<HTMLDivElement>(null);
	const [email, setEmail] = useState("");
	const [loading, setIsLoading] = useState(false);

	const scrollToCTA = () => {
		ctaRef.current?.scrollIntoView({ behavior: "smooth" });
		setIsSticky(false);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.target === ctaRef.current) {
						setIsVisible(entry.isIntersecting);
						setIsSticky(!entry.isIntersecting);
					}
				});
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1,
			}
		);

		if (ctaRef.current) {
			observer.observe(ctaRef.current);
		}

		return () => {
			if (ctaRef.current) {
				observer.unobserve(ctaRef.current);
			}
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to subscribe");
			}

			setEmail("");

			toast("Successfully subscribed! 🎉", {
				description: "Welcome to the future of tech glitches.",
				action: {
					label: "Undo",
					onClick: async () => {
						await unsubscribeToNewsletter(email);
						toast("Successfully unsubscribed!");
					},
				},
			});
		} catch (error) {
			toast.error("Subscription failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{/* Main CTA section */}
			<section
				ref={ctaRef}
				className={cn(
					"w-full bg-black text-white py-24 md:py-32 overflow-hidden",
					isVisible && "animate-in fade-in duration-1000"
				)}
			>
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
						<div className="flex-1 space-y-6 text-center md:text-left">
							<h2 className="text-4xl md:text-6xl font-serif leading-tight">
								The future is <span className="italic text-primary">glitched</span>.
							</h2>
							<p className="text-white/60 text-lg max-w-md font-sans">
								Join 50,000+ readers getting our weekly dose of tech insights and playful commentary.
							</p>
						</div>

						<div className="w-full md:w-auto flex-shrink-0">
							<form
								onSubmit={handleSubmit}
								className="flex flex-col gap-4 w-full md:w-96"
							>
								<div className="relative group">
									<input
										type="email"
										placeholder="STAY CONNECTED (EMAIL)"
										className="w-full bg-transparent border-b-2 border-white/20 py-4 px-1 text-sm tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/30 uppercase font-black"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									<div className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-focus-within:w-full transition-all duration-500"></div>
								</div>
								<button
									type="submit"
									disabled={loading}
									className="group flex items-center justify-between py-4 px-1 border-b-2 border-white/20 hover:border-primary transition-all text-left"
								>
									<span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
										{loading ? "PROCESSING..." : "JOIN THE LIST"}
									</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="transition-transform group-hover:translate-x-1"
									>
										<line x1="5" y1="12" x2="19" y2="12" />
										<polyline points="12 5 19 12 12 19" />
									</svg>
								</button>
							</form>
							<p className="text-[8px] uppercase tracking-widest text-white/40 mt-6 text-center md:text-left">
								BY JOINING, YOU AGREE TO OUR IMAGINATIVE TERMS.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Sticky CTA */}
			{isSticky && (
				<div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white transform transition-transform duration-500 animate-in slide-in-from-bottom border-t border-white/10">
					<div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
							<span className="text-[10px] uppercase tracking-widest font-black hidden sm:inline">Latest: Myths on the edge</span>
						</div>
						<button
							onClick={scrollToCTA}
							className="text-[10px] uppercase tracking-[0.3em] font-black hover:text-primary transition-colors"
						>
							SUBSCRIBE NOW
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default CTA;
