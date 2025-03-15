import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { siteName } from "@/lib/config";

const CTA = () => {
	const [isVisible, setIsVisible] = useState(false);
	const ctaRef = useRef<HTMLDivElement>(null);
	const [email, setEmail] = useState("");
	const [loading, setIsLoading] = useState(false);

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

			// Clear the form
			setEmail("");

			// Show success toast
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

	return (
		<section
			ref={ctaRef}
			className={cn(
				"container mx-auto px-6 py-16 animate-on-scroll fade-in",
				isVisible && "active"
			)}
		>
			<div className="w-full max-w-4xl mx-auto bg-secondary/50 border border-border rounded-lg overflow-hidden">
				<div className="p-8 md:p-12">
					<div className="text-center max-w-2xl mx-auto space-y-4">
						<h2 className="text-2xl md:text-3xl font-medium tracking-tight">
							Stay Updated with {siteName}
						</h2>
						<p className="text-muted-foreground">
							Subscribe to our newsletter for a weekly dose of
							playful tech insights. No spam, just fun.
						</p>

						<form
							onSubmit={handleSubmit}
							className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
						>
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-grow px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<button
								type="submit"
								className="whitespace-nowrap px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								Subscribe
							</button>
						</form>

						<p className="text-xs text-muted-foreground mt-4">
							By subscribing, you agree to receive lighthearted,
							imaginative content and accept our privacy policy.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTA;
