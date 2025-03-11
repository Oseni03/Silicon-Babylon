import Link from "next/link";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full bg-secondary/50 border-t border-border py-12 px-6">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="space-y-4">
						<Link
							href="/"
							className="flex items-center space-x-2 group"
						>
							<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
								<span className="text-primary-foreground font-semibold text-lg">
									S
								</span>
							</div>
							<span className="font-medium text-xl tracking-tight">
								SatiricTech
							</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Where real tech news meets imaginary insights.
						</p>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-medium">Navigation</h3>
						<nav className="flex flex-col space-y-2">
							<Link
								href="/"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Home
							</Link>
							<Link
								href="/about"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								About
							</Link>
							<Link
								href="/archive"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Archive
							</Link>
						</nav>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-medium">Legal</h3>
						<nav className="flex flex-col space-y-2">
							<Link
								href="/terms"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Terms & Conditions
							</Link>
							<Link
								href="/privacy"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Privacy Policy
							</Link>
							<div className="text-sm text-muted-foreground">
								© {currentYear} SatiricTech
							</div>
						</nav>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
