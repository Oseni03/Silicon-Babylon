import React from "react";
import Link from "next/link";
import { siteName } from "@/lib/config";
import { Logo } from "./Logo";
import { categories } from "@/lib/utils";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-background border-t border-black pt-16 pb-8">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
					{/* Brand Column */}
					<div className="md:col-span-1">
						<Logo className="md:items-start mb-6" />
						<p className="text-sm text-black/60 max-w-xs leading-relaxed">
							Probably accurate news, most of the time. Exploring the intersection of technology, myths, and the future.
						</p>
					</div>

					{/* Pages Column */}
					<div>
						<h4 className="font-serif mb-6 uppercase tracking-widest text-xs">Pages</h4>
						<ul className="space-y-4">
							<li><Link href="/" className="text-sm hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">Home</Link></li>
							<li><Link href="/about" className="text-sm hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">About</Link></li>
							<li><Link href="/subscribe" className="text-sm hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">Subscribe</Link></li>
						</ul>
					</div>

					{/* Categories Column */}
					<div>
						<h4 className="font-serif mb-6 uppercase tracking-widest text-xs">Categories</h4>
						<ul className="space-y-4">
							{categories.slice(0, 5).map((category) => (
						<li key={category.slug}>
									<Link href={`/category/${category.slug}`} className="text-sm hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Column */}
					<div>
						<h4 className="font-serif mb-6 uppercase tracking-widest text-xs">Contact</h4>
						<ul className="space-y-4">
							<li><Link href="https://x.com/Oseni03" className="text-sm hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">X (Twitter)</Link></li>
							<li><Link href="mailto:contact@silicon-babylon.info" className="text-sm hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">Email us</Link></li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-[10px] uppercase tracking-widest text-black/40">
						© {currentYear} {siteName}. All rights reserved.
					</p>
					<div className="flex gap-6">
						<Link href="/privacy" className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground">Privacy</Link>
						<Link href="/terms" className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground">Terms</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
