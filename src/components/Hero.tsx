"use client"

import { useEffect, useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";

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
			className="relative h-screen flex items-center justify-center overflow-hidden transition-all duration-300 ease-out border-b border-black"
		>
			<div
				className="absolute inset-0 z-0 bg-gradient-to-b from-secondary/40 to-background/20"
				aria-hidden="true"
			/>

			<div className="container mx-auto px-4 sm:px-6 z-10">
				<div className="max-w-3xl mx-auto text-center space-y-8 px-2">
					<AnimatedSection direction="down" delay={0.1}>
						<div className="inline-block px-4 py-1.5 border border-black text-[10px] uppercase tracking-[0.3em] font-black">
							Autonomous Tech Commentary Platform
						</div>
					</AnimatedSection>

					<AnimatedSection direction="up" delay={0.3} distance={40}>
						<h1 className="hero-text text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif leading-[1] tracking-tight">
							Discover the Intersection of
							<span className="block text-primary drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
								Tech and Humor
							</span>
						</h1>
					</AnimatedSection>

					<AnimatedSection direction="up" delay={0.5} distance={30}>
						<p className="text-lg sm:text-xl md:text-2xl text-foreground font-serif italic max-w-2xl mx-auto leading-relaxed">
							Dive into a world where cutting-edge tech meets sharp wit! Explore stories that spark curiosity, ignite laughter, and challenge the norm.
						</p>
					</AnimatedSection>

					<AnimatedSection direction="up" delay={0.7} distance={20} className="pt-8">
						<a
							href="#latest-articles"
							className="group relative inline-flex flex-col items-center gap-4"
						>
							<span className="text-[10px] uppercase tracking-[0.4em] font-black group-hover:text-primary transition-colors">
								Read Latest Articles
							</span>
							<div className="w-12 h-0.5 bg-black group-hover:w-24 transition-all duration-700"></div>
						</a>
					</AnimatedSection>

					<div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-40">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
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
