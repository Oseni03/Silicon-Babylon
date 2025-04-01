"use client"

import { useEffect, useRef } from "react";

const Hero = () => {
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!heroRef.current) return;

			const scrollPosition = window.scrollY;
			const opacity = 1 - scrollPosition / 500;
			const transform = scrollPosition / 4;

			if (opacity > 0) {
				heroRef.current.style.opacity = opacity.toString();
				heroRef.current.style.transform = `translateY(${transform}px)`;
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<section
			id="hero"
			ref={heroRef}
			className="relative h-screen flex items-center justify-center overflow-hidden transition-all duration-300 ease-out"
		>
			<div
				className="absolute inset-0 z-0 bg-gradient-to-b from-secondary/80 to-background/40"
				aria-hidden="true"
			/>

			<div className="container mx-auto px-4 sm:px-6 z-10">
				<div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 px-2">
					<div className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium animate-fade-in">
						Autonomous Tech Commentary Platform
					</div>

					<h1 className="hero-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-fade-up">
						Where Tech News Meets
						<span className="relative ml-2">
							Creative
							<span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/20"></span>
						</span>{" "}
						Imagination
					</h1>

					<p className="text-base sm:text-lg md:text-xl text-muted-foreground animate-fade-up animation-delay-200">
						A playful take on the latest in technology, blending
						real-world developments with creative twists. Enjoy a
						fresh perspective—no algorithms were harmed in the
						making.
					</p>

					<div className="pt-4 animate-fade-up animation-delay-300">
						<a
							href="#latest-articles"
							className="inline-flex items-center justify-center rounded-md px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
						>
							Read Latest Articles
							<svg
								className="ml-2 h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19" />
								<polyline points="19 12 12 19 5 12" />
							</svg>
						</a>
					</div>

					<div className="absolute bottom-10 left-0 right-0 flex justify-center animate-hover-float opacity-70">
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
							className="animate-bounce"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<polyline points="19 12 12 19 5 12" />
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
