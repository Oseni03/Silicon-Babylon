"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/config";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TermsPage = () => {
	const [isVisible, setIsVisible] = useState({
		section1: false,
		section2: false,
		section3: false,
	});

	const section1Ref = useRef<HTMLDivElement>(null);
	const section2Ref = useRef<HTMLDivElement>(null);
	const section3Ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.title = `Terms & Conditions - ${siteName}`;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === section1Ref.current) {
							setIsVisible((prev) => ({
								...prev,
								section1: true,
							}));
						} else if (entry.target === section2Ref.current) {
							setIsVisible((prev) => ({
								...prev,
								section2: true,
							}));
						} else if (entry.target === section3Ref.current) {
							setIsVisible((prev) => ({
								...prev,
								section3: true,
							}));
						}
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
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow pt-24">
				<section className="container mx-auto px-6 py-16">
					<div className="max-w-3xl mx-auto">
						<div className="text-center space-y-4 mb-16">
							<div className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
								Legal
							</div>
							<h1 className="text-4xl font-medium tracking-tight">
								Terms & Conditions
							</h1>
							<p className="text-lg text-muted-foreground">
								Last updated:{" "}
								{new Date().toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
								})}
							</p>
						</div>

						<div
							ref={section1Ref}
							className={cn(
								"space-y-8 animate-on-scroll fade-in",
								isVisible.section1 && "active"
							)}
						>
							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									1. Introduction
								</h2>
								<p>
									Welcome to {siteName}! These Terms &
									Conditions govern your use of our website
									and services. By accessing or using
									{siteName}, you agree to be bound by these
									Terms. If you disagree with any part of the
									terms, you may not access the service.
								</p>
								<p>
									{siteName} provides AI-generated mythical
									content based on real technology news. While
									we aim to entertain, our content should not
									be taken as factual reporting.
								</p>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									2. Content Disclaimer
								</h2>
								<p>
									All content published on {siteName} is
									mythical in nature and is generated with
									the assistance of artificial intelligence.
									The articles, stories, and other content are
									works of fiction and humor.
								</p>
								<p>
									Our content may reference real companies,
									products, and individuals, but the events,
									quotes, and circumstances described are
									entirely fictional. Any resemblance to
									actual events, locales, or persons is
									coincidental or used for mythical purposes.
								</p>
							</div>
						</div>

						<div
							ref={section2Ref}
							className={cn(
								"space-y-8 mt-16 animate-on-scroll fade-in",
								isVisible.section2 && "active"
							)}
						>
							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									3. Intellectual Property
								</h2>
								<p>
									The content, features, and functionality of
									the {siteName} website, including but not
									limited to text, graphics, logos, and
									articles, are owned by {siteName} and are
									protected by international copyright,
									trademark, and other intellectual property
									laws.
								</p>
								<p>
									You may access, view, and share our content
									for personal, non-commercial use. However,
									you may not reproduce, distribute, modify,
									create derivative works of, publicly
									display, or exploit our content in any way
									without our explicit permission.
								</p>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									4. User Conduct
								</h2>
								<p>When using our website, you agree not to:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Use the service for any illegal purpose
										or in violation of any laws
									</li>
									<li>
										Interfere with or disrupt the service or
										servers
									</li>
									<li>
										Collect or harvest any information from
										the service
									</li>
									<li>Impersonate any person or entity</li>
									<li>
										Engage in any activity that could
										damage, disable, or impair the service
									</li>
								</ul>
							</div>
						</div>

						<div
							ref={section3Ref}
							className={cn(
								"space-y-8 mt-16 animate-on-scroll fade-in",
								isVisible.section3 && "active"
							)}
						>
							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									5. Limitation of Liability
								</h2>
								<p>
									{siteName} and its affiliates, employees, or
									contributors shall not be liable for any
									indirect, incidental, special,
									consequential, or punitive damages resulting
									from your access to or use of, or inability
									to access or use, the service.
								</p>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									6. Changes to Terms
								</h2>
								<p>
									We reserve the right to modify or replace
									these Terms at any time. If a revision is
									material, we will provide at least 30 days'
									notice prior to any new terms taking effect.
									What constitutes a material change will be
									determined at our sole discretion.
								</p>
								<p>
									By continuing to access or use our service
									after any revisions become effective, you
									agree to be bound by the revised terms. If
									you do not agree to the new terms, you are
									no longer authorized to use the service.
								</p>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									7. Contact Us
								</h2>
								<p>
									If you have any questions about these Terms,
									please{" "}
									<Link
										className="text-base font-medium py-2 hover:text-primary transition-colors mx-2"
										href={"/contact"}
									>
										<Button
											size="sm"
											className="rounded-full"
										>
											contact us
										</Button>
									</Link>
									.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default TermsPage;
