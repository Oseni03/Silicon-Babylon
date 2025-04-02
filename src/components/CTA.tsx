"use client"

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { siteName } from "@/lib/config";

const CTA = () => {
	const [isVisible, setIsVisible] = useState(true); // Changed to true by default
	const [isSticky, setIsSticky] = useState(false); // Changed to false by default
	const [isInHero, setIsInHero] = useState(false); // Changed to false by default
	const ctaRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const [email, setEmail] = useState("");
	const [loading, setIsLoading] = useState(false);

	const scrollToCTA = () => {
		ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
		setIsSticky(false);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
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
			const response = await fetch("/api/newsletter", {
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
				description:
					"Get ready for playful tech insights delivered straight to your inbox.",
			});
		} catch (error) {
			toast.error("Subscription failed", {
				description:
					error instanceof Error
						? error.message
						: "Failed to subscribe",
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	const MainCTAContent = () => (
		<div className="text-center max-w-2xl mx-auto space-y-4">
			<h2 className="text-xl font-medium tracking-tight">
				Stay Updated with {siteName}
			</h2>
			<p className="text-muted-foreground">
				Subscribe to our newsletter for a weekly dose of
				playful tech insights. No spam, just fun and fact.
			</p>
			<form
				onSubmit={handleSubmit}
				className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
			>
				<input
					type="email"
					placeholder="Enter your email"
					className="flex-grow px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="whitespace-nowrap px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
				>
					Subscribe
				</button>
			</form>
			<p className="text-xs text-muted-foreground mt-4">
				By subscribing, you agree to receive lighthearted,
				imaginative content and accept our privacy policy.
			</p>
		</div>
	);

	const StickyCTAContent = () => (
		<div className="flex items-center justify-between gap-4 sm:gap-6">
			<div className="space-y-1.5 flex-1">
				<h3 className="text-sm font-medium">Stay Updated with {siteName}</h3>
				<p className="text-xs text-muted-foreground">
					Get weekly tech insights and playful content in your inbox
				</p>
			</div>
			<button
				onClick={scrollToCTA}
				className="shrink-0 h-11 whitespace-nowrap px-6 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
			>
				Subscribe Now
			</button>
		</div>
	);

	return (
		<>
			{/* Main CTA section */}
			<section
				ref={ctaRef}
				className={cn(
					"container mx-auto px-6 py-16 animate-on-scroll fade-in",
					isVisible && "active"
				)}
			>
				<div className="w-full max-w-4xl mx-auto bg-secondary/50 border border-border rounded-lg overflow-hidden">
					<div className="p-8 md:p-12">
						<MainCTAContent />
					</div>
				</div>
			</section>

			{/* Sticky CTA */}
			{isSticky && !isInHero && (
				<section className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border">
					<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
						<div className="relative w-full max-w-4xl mx-auto">
							<button
								onClick={() => setIsSticky(false)}
								className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-primary/10 rounded-full"
								aria-label="Close subscription form"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
							</button>
							<StickyCTAContent />
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default CTA;
