"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/config";

const Page = () => {
	const [isVisible, setIsVisible] = useState({
		section1: false,
		section2: false,
		section3: false,
	});

	const section1Ref = useRef<HTMLDivElement>(null);
	const section2Ref = useRef<HTMLDivElement>(null);
	const section3Ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.title = `About - ${siteName}`;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === section1Ref.current) {
							setIsVisible((prev) => ({ ...prev, section1: true }));
						} else if (entry.target === section2Ref.current) {
							setIsVisible((prev) => ({ ...prev, section2: true }));
						} else if (entry.target === section3Ref.current) {
							setIsVisible((prev) => ({ ...prev, section3: true }));
						}
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (section1Ref.current) observer.observe(section1Ref.current);
		if (section2Ref.current) observer.observe(section2Ref.current);
		if (section3Ref.current) observer.observe(section3Ref.current);

		return () => {
			if (section1Ref.current) observer.unobserve(section1Ref.current);
			if (section2Ref.current) observer.unobserve(section2Ref.current);
			if (section3Ref.current) observer.unobserve(section3Ref.current);
		};
	}, []);

	return (
		<div className="flex flex-col min-h-screen bg-background font-sans">
			<Header />
			<main className="flex-grow">
				<section className="container mx-auto px-4 md:px-6 py-24 md:py-32 border-t border-black">
					<div className="max-w-4xl mx-auto">
						<div className="space-y-8 mb-24">
							<span className="text-[10px] uppercase tracking-[0.3em] font-black border-b border-black pb-1">
								The Manifesto
							</span>
							<h1 className="text-5xl md:text-8xl font-serif tracking-tight leading-[0.9]">
								Myth is the <br/><span className="italic text-primary">highest</span> form of truth.
							</h1>
							<p className="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-2xl">
								In a world of hyper-innovation, we provide the necessary friction.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
							<div className="md:col-span-4">
								<div className="sticky top-24 space-y-4">
									<div className="w-12 h-px bg-black"></div>
									<h2 className="text-[10px] uppercase tracking-[0.2em] font-black">Our Mission</h2>
								</div>
							</div>
							<div className="md:col-span-8 space-y-8">
								<p className="text-lg leading-relaxed text-black/80">
									{siteName} was established as a counterbalance to the relentless optimism of the technology sector. While others report on specs and funding rounds, we report on the absurdity that often lies beneath the surface.
								</p>
								<p className="text-lg leading-relaxed text-black/80">
									Our goal isn't just to entertain, but to provoke thought. In the age of AI and exponential growth, the human element—with all its flaws and humor—is more important than ever.
								</p>
							</div>
						</div>

						<div className="mt-32 pt-24 border-t border-black/10">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
								<div className="space-y-6">
									<span className="text-[10px] uppercase tracking-widest font-black text-primary">01. Collection</span>
									<h3 className="text-3xl font-serif">Curated Intelligence</h3>
									<p className="text-muted-foreground leading-relaxed">
										We analyze thousands of data points and headlines from global tech leaders to find the stories that deserve a second, more mythical look.
									</p>
								</div>
								<div className="space-y-6">
									<span className="text-[10px] uppercase tracking-widest font-black text-primary">02. Analysis</span>
									<h3 className="text-3xl font-serif">Deep Cynicism</h3>
									<p className="text-muted-foreground leading-relaxed">
										Every article is crafted with a deep understanding of the industry, ensuring our mythical takes hit the mark and reveals the underlying truth.
									</p>
								</div>
							</div>
						</div>

						<div className="mt-32 bg-black text-white p-12 md:p-24 text-center space-y-8">
							<h2 className="text-3xl md:text-5xl font-serif italic">"Technology is a useful servant but a dangerous master."</h2>
							<p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-50">— CHRISTIAN LANGE</p>
						</div>

						<div className="mt-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
							<div className="md:col-span-4">
								<div className="sticky top-24 space-y-4">
									<div className="w-12 h-px bg-black"></div>
									<h2 className="text-[10px] uppercase tracking-[0.2em] font-black">Join Us</h2>
								</div>
							</div>
							<div className="md:col-span-8 space-y-8">
								<p className="text-2xl font-serif leading-relaxed">
									We are always looking for sharp minds and even sharper wits. If you believe you can see through the hype and want to help others do the same, let's talk.
								</p>
								<button className="group flex items-center gap-4 py-4 text-left">
									<span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
										CONTACT THE EDITORIAL TEAM
									</span>
									<div className="w-12 h-px bg-black group-hover:w-24 transition-all duration-500"></div>
								</button>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Page;
