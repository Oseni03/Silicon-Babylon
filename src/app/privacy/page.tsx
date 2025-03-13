"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/config";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => {
	const [isVisible, setIsVisible] = useState({
		section1: false,
		section2: false,
		section3: false,
	});

	const section1Ref = useRef<HTMLDivElement>(null);
	const section2Ref = useRef<HTMLDivElement>(null);
	const section3Ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.title = `Privacy Policy - ${siteName}`;

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
								Privacy Policy
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
									{siteName} ("we", "our", or "us") is
									committed to protecting your privacy. This
									Privacy Policy explains how we collect, use,
									disclose, and safeguard your information
									when you visit our website.
								</p>
								<p>
									We reserve the right to make changes to this
									Privacy Policy at any time and for any
									reason. We will alert you about any changes
									by updating the "Last Updated" date of this
									policy. Any changes or modifications will be
									effective immediately upon posting the
									updated Privacy Policy on the website.
								</p>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									2. Information We Collect
								</h2>
								<h3 className="text-lg font-medium mt-4">
									Personal Data
								</h3>
								<p>
									When you interact with our website, we may
									collect personal data that can be used to
									contact or identify you, such as:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Email address (if you subscribe to our
										newsletter)
									</li>
									<li>Usage data and preferences</li>
									<li>IP address and browser information</li>
								</ul>

								<h3 className="text-lg font-medium mt-4">
									Usage Data
								</h3>
								<p>
									We may also collect information on how the
									website is accessed and used. This usage
									data may include information such as your
									computer's IP address, browser type, browser
									version, the pages of our website that you
									visit, the time and date of your visit, the
									time spent on those pages, and other
									diagnostic data.
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
									3. How We Use Your Information
								</h2>
								<p>
									We may use the information we collect from
									you to:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Provide, operate, and maintain our
										website
									</li>
									<li>
										Improve, personalize, and expand our
										website
									</li>
									<li>
										Understand and analyze how you use our
										website
									</li>
									<li>
										Develop new products, services,
										features, and functionality
									</li>
									<li>
										Send you emails (if you've subscribed to
										our newsletter)
									</li>
									<li>Find and prevent fraud</li>
								</ul>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									4. Cookies and Tracking Technologies
								</h2>
								<p>
									We use cookies and similar tracking
									technologies to track activity on our
									website and hold certain information.
									Cookies are files with a small amount of
									data which may include an anonymous unique
									identifier.
								</p>
								<p>
									You can instruct your browser to refuse all
									cookies or to indicate when a cookie is
									being sent. However, if you do not accept
									cookies, you may not be able to use some
									portions of our website.
								</p>
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
									5. Disclosure of Data
								</h2>
								<p>
									We may disclose your personal data in the
									following situations:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>Legal Requirements:</strong> To
										comply with a legal obligation
									</li>
									<li>
										<strong>Business Transfers:</strong> In
										connection with, or during negotiations
										of, any merger, sale of company assets,
										financing, or acquisition
									</li>
									<li>
										<strong>With Your Consent:</strong> With
										your consent in any other cases
									</li>
									<li>
										<strong>Other:</strong> To our trusted
										third-party service providers who assist
										us in operating our website and
										conducting our business
									</li>
								</ul>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									6. Security of Data
								</h2>
								<p>
									The security of your data is important to
									us, but remember that no method of
									transmission over the Internet, or method of
									electronic storage is 100% secure. While we
									strive to use commercially acceptable means
									to protect your personal data, we cannot
									guarantee its absolute security.
								</p>
							</div>

							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									7. Your Rights
								</h2>
								<p>
									Depending on your location, you may have
									certain rights regarding your personal
									information, such as:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										The right to access the personal
										information we have about you
									</li>
									<li>
										The right to request correction of
										inaccurate personal information
									</li>
									<li>
										The right to request deletion of your
										personal information
									</li>
									<li>
										The right to object to processing of
										your personal information
									</li>
									<li>The right to data portability</li>
								</ul>
								<p className="mt-4">
									To exercise any of these rights, please
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

export default PrivacyPage;
