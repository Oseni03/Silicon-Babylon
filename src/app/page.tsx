"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArticlesList from "@/components/ArticlesList";
import Disclaimer from "@/components/Disclaimer";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Page = () => {
	useEffect(() => {
		document.title =
			"SatiricTech - AI-Crafted Commentary Inspired by Real Tech Headlines";

		// Observer for animate-on-scroll elements
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("active");
						observer.unobserve(entry.target);
					}
				});
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1,
			}
		);

		// Observe all elements with animate-on-scroll class
		document.querySelectorAll(".animate-on-scroll").forEach((el) => {
			observer.observe(el);
		});

		return () => {
			document.querySelectorAll(".animate-on-scroll").forEach((el) => {
				observer.unobserve(el);
			});
		};
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow">
				<Hero />
				<Disclaimer />
				<ArticlesList />
				<CTA />
			</main>
			<Footer />
		</div>
	);
};

export default Page;
