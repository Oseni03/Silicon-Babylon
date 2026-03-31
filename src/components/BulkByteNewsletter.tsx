import * as React from "react";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
	Button,
	Hr,
	Tailwind,
} from "@react-email/components";
import { siteName, siteUrl } from "@/lib/config";
import { Article } from "@/types/types";

const BulkByteNewsletter = ({
	email,
	issueNumber,
	summary,
	articles,
}: {
	issueNumber: string;
	email?: string;
	summary: string;
	articles: Article[];
}) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>
					This week's tech bytes: AI gets existential, crypto does
					crypto things, and more probably accurate news!
				</Preview>
				<Body className="bg-black py-[40px] font-sans">
					<Container className="bg-black max-w-[600px] mx-auto px-[20px]">
						{/* Header */}
						<Section className="text-center mb-[32px]">
							<Heading className="text-[#f8f8f8] text-[32px] font-bold m-0 mb-[8px]">
								{siteName}
							</Heading>
							<Text className="text-[#7a7676] text-[16px] m-0 mb-[16px]">
								Bulk-Byte Newsletter #{issueNumber}
							</Text>
							<Text className="text-[#7a7676] text-[14px] m-0">
								Where real tech news meets imaginary insights
							</Text>
						</Section>

						{/* Welcome Message */}
						<Section className="mb-[32px]">
							<Text className="text-[#f8f8f8] text-[16px] leading-[24px] m-0 mb-[16px]">
								Hey there! 👋
							</Text>
							<Text className="text-[#f8f8f8] text-[16px] leading-[24px] m-0">
								Ready for another dose of probably accurate tech
								news? {summary}
							</Text>
							{/* <Text className="text-[#f8f8f8] text-[16px] leading-[24px] m-0">
								Ready for another dose of probably accurate tech
								news? We've got AI having midlife crises,
								startups pivoting to pet rocks, and the usual
								crypto shenanigans. Let's dive into this week's
								digital chaos!
							</Text> */}
						</Section>

						{/* Main Stories */}
						<Section className="mb-[40px]">
							<Heading className="text-[#f8f8f8] text-[24px] font-bold m-0 mb-[24px]">
								🔥 This Week's Hot Bytes
							</Heading>

							{/* Story 1 */}
							{articles.slice(0, 4).map((article, index) => (
								<Section
									key={index}
									className="mb-[24px] p-[16px] border border-solid border-[#7a7676] rounded-[8px]"
								>
									<Heading className="text-[#f8f8f8] text-[18px] font-bold m-0 mb-[8px]">
										{article.title}
									</Heading>
									<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[12px]">
										{article.description ||
											article.content.substring(0, 100) +
												"..."}
									</Text>
									<Link
										href={`${siteUrl}/article/${article.slug}`}
										className="text-[#7a7676] text-[14px] font-medium hover:underline"
									>
										Read the full story →
									</Link>
								</Section>
							))}
						</Section>

						<Hr className="border-[#7a7676] my-[32px]" />

						{/* Book Recommendations Section */}
						<Section className="mb-[40px]">
							<Heading className="text-[#f8f8f8] text-[20px] font-bold m-0 mb-[16px]">
								📚 Developer Bookshelf: Because Stack Overflow
								Can't Teach You Everything
							</Heading>

							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[24px]">
								While we're busy making fun of tech trends, here
								are some actually useful books to level up your
								dev game. (Yes, we get a tiny commission if you
								buy through our links - gotta fund our mythical
								journalism somehow!)
							</Text>

							{/* Book 1 */}
							<Section className="mb-[20px] p-[16px] bg-[#1a1a1a] rounded-[8px] border border-solid border-[#7a7676]">
								<Heading className="text-[#f8f8f8] text-[16px] font-bold m-0 mb-[8px]">
									"Clean Code" by Robert C. Martin
								</Heading>
								<Text className="text-[#f8f8f8] text-[13px] leading-[18px] m-0 mb-[12px]">
									The holy grail of not writing code that
									makes your future self cry. Uncle Bob
									teaches you how to write code so clean, it
									practically sparkles. Perfect for when you
									want to impress your code reviewers instead
									of traumatizing them.
								</Text>
								<Button
									href="https://amzn.to/4gpNEwY"
									className="bg-[#7a7676] text-white px-[16px] py-[8px] rounded-[4px] text-[12px] font-medium box-border hover:bg-[#8a8686] text-decoration-none"
								>
									Buy on Amazon →
								</Button>
							</Section>

							{/* Book 2 */}
							<Section className="mb-[20px] p-[16px] bg-[#1a1a1a] rounded-[8px] border border-solid border-[#7a7676]">
								<Heading className="text-[#f8f8f8] text-[16px] font-bold m-0 mb-[8px]">
									"The Pragmatic Programmer" by David Thomas &
									Andrew Hunt
								</Heading>
								<Text className="text-[#f8f8f8] text-[13px] leading-[18px] m-0 mb-[12px]">
									The developer's survival guide for when you
									realize programming is 10% coding and 90%
									debugging, crying, and questioning your life
									choices. This book helps with the first
									part, you're on your own for the crying.
								</Text>
								<Button
									href="https://amzn.to/4gjNA1D"
									className="bg-[#7a7676] text-white px-[16px] py-[8px] rounded-[4px] text-[12px] font-medium box-border hover:bg-[#8a8686] text-decoration-none"
								>
									Buy on Amazon →
								</Button>
							</Section>

							{/* Book 3 */}
							<Section className="mb-[20px] p-[16px] bg-[#1a1a1a] rounded-[8px] border border-solid border-[#7a7676]">
								<Heading className="text-[#f8f8f8] text-[16px] font-bold m-0 mb-[8px]">
									"System Design Interview" by Alex Xu
								</Heading>
								<Text className="text-[#f8f8f8] text-[13px] leading-[18px] m-0 mb-[12px]">
									For when you need to convince interviewers
									you can design the next Facebook, even
									though you still struggle with centering
									divs. Includes helpful diagrams that make
									you look like you know what "eventual
									consistency" actually means.
								</Text>
								<Button
									href="https://amzn.to/48e7Fo0"
									className="bg-[#7a7676] text-white px-[16px] py-[8px] rounded-[4px] text-[12px] font-medium box-border hover:bg-[#8a8686] text-decoration-none"
								>
									Buy on Amazon →
								</Button>
							</Section>

							<Text className="text-[#7a7676] text-[11px] m-0 mt-[16px]">
								* These are affiliate links. We earn a small
								commission at no extra cost to you. Thanks for
								supporting our glitched shenanigans!
							</Text>
						</Section>

						<Hr className="border-[#7a7676] my-[32px]" />

						{/* Sponsored Post Section - Spaark.dev */}
						<Section className="mb-[40px] p-[20px] bg-[#1a1a1a] rounded-[8px] border border-solid border-[#7a7676]">
							<Text className="text-[#7a7676] text-[12px] font-bold m-0 mb-[16px] uppercase tracking-[1px]">
								Sponsored Content
							</Text>

							<Heading className="text-[#f8f8f8] text-[20px] font-bold m-0 mb-[16px]">
								Stop Coding Your Portfolio from Scratch (Again)
								🤦‍♂️
							</Heading>

							<Text className="text-[#f8f8f8] text-[16px] leading-[24px] m-0 mb-[16px]">
								We get it. You're a developer, not a designer.
								You've spent 47 hours trying to center a div on
								your portfolio homepage, and it's still
								mysteriously floating to the left like a
								rebellious CSS property.
							</Text>

							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[16px]">
								<strong>Enter Spaark.dev</strong> - the
								portfolio builder that actually understands
								developers:
							</Text>

							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[4px]">
								✨ <strong>Dev-focused templates</strong> that
								don't look like they were designed in 2003
							</Text>
							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[4px]">
								📝 <strong>Built-in tech blog</strong> for your
								"Why I Switched to Vim" articles
							</Text>
							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[4px]">
								🌐 <strong>Custom domain + SSL</strong> because
								you're not an amateur
							</Text>
							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[20px]">
								⚡ <strong>CDN included</strong> for
								blazing-fast load times (your visitors will
								thank you)
							</Text>

							<Button
								href="https://spaark.dev"
								className="bg-white text-black px-[24px] py-[12px] rounded-[6px] text-[14px] font-medium box-border hover:bg-gray-100 text-decoration-none"
							>
								Build Your Portfolio →
							</Button>

							<Text className="text-[#7a7676] text-[11px] m-0 mt-[12px]">
								Starting at $0/month - Yes, actually free! No
								hidden fees, no "gotchas", just good vibes and
								great portfolios
							</Text>
						</Section>

						<Hr className="border-[#7a7676] my-[32px]" />

						{articles.length > 4 && (
							<Section className="mb-[40px]">
								<Heading className="text-[#f8f8f8] text-[20px] font-bold m-0 mb-[20px]">
									⚡ Quick Bytes
								</Heading>

								{articles.slice(4).map((article, index) => (
									<Text
										key={index}
										className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[8px]"
									>
										• {article.title}
									</Text>
								))}
							</Section>
						)}

						{/* CTA Section */}
						<Section className="text-center mb-[40px] p-[20px] border border-solid border-[#7a7676] rounded-[8px]">
							<Heading className="text-[#f8f8f8] text-[18px] font-bold m-0 mb-[12px]">
								Want More Mythical Tech News?
							</Heading>
							<Text className="text-[#f8f8f8] text-[14px] leading-[20px] m-0 mb-[16px]">
								Visit our website for daily doses of probably
								accurate tech coverage!
							</Text>
							<Button
								href={siteUrl}
								className="bg-white text-black px-[24px] py-[12px] rounded-[6px] text-[14px] font-medium box-border hover:bg-gray-100 text-decoration-none"
							>
								Visit {siteName} →
							</Button>
						</Section>

						{/* Footer */}
						<Hr className="border-[#7a7676] my-[32px]" />

						<Section className="text-center">
							<Text className="text-[#7a7676] text-[12px] leading-[16px] m-0 mb-[8px]">
								Where real tech news meets imaginary insights
							</Text>

							<Text className="text-[#7a7676] text-[12px] leading-[16px] m-0 mb-[16px]">
								By subscribing, you agree to receive
								lighthearted, imaginative content and accept our
								privacy policy.
							</Text>

							<Text className="text-[#7a7676] text-[12px] leading-[16px] m-0 mb-[8px]">
								<Link
									href={`${siteUrl}/unsubscribe?email=${email}`}
									className="text-[#7a7676] hover:underline"
								>
									Unsubscribe
								</Link>
								{/* {" | "}
								<Link
									href={`${siteUrl}/update-preferences?email=${email}`}
									className="text-[#7a7676] hover:underline"
								>
									Update Preferences
								</Link> */}
								{" | "}
								<Link
									href={`${siteUrl}/privacy-policy`}
									className="text-[#7a7676] hover:underline"
								>
									Privacy Policy
								</Link>
							</Text>

							<Text className="text-[#7a7676] text-[11px] m-0">
								© {new Date().getFullYear()} {siteName}
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default BulkByteNewsletter;
