import { type Article, type AffiliateProgram } from "@/types/types";

export const programmes: AffiliateProgram[] = [
	{
		title: "NordVPN's Threat Protection Pro™: Because Who Needs a Dedicated Antivirus Anymore?",
		content:
			"<p>In a bold move to simplify your cybersecurity shopping list, NordVPN introduces Threat Protection Pro™—a feature that not only encrypts your data but also scans your downloads for malware, blocks malicious websites, and even stops those pesky ads and trackers. It's like having a Swiss Army knife for your digital life, minus the actual knife. So, why clutter your device with multiple security apps when one can do it all? Embrace the future of online protection and let NordVPN's Threat Protection Pro™ be your one-stop shop for cybersecurity. <a href=\"https://nordvpn.com/antivirus/\">Learn more</a></p>",
		keywords: [
			"NordVPN",
			"Threat Protection Pro",
			"antivirus",
			"online security",
			"malware protection",
		],
		url: "https://go.nordvpn.net/aff_c?offer_id=725&aff_id=119891",
	},
	{
		title: "NordVPN: Because Who Doesn't Love Adding Extra Layers to Their Already Complicated Digital Lives?",
		content:
			"<p>In a world where your refrigerator might be spying on you, NordVPN heroically steps in to encrypt your every move. With over 7,000 servers worldwide, because who doesn't need that many options to watch cat videos securely? :contentReference[oaicite:0]{index=0} And let's not forget the 'Double VPN' feature—because single encryption is so last year. :contentReference[oaicite:1]{index=1} So, why not add another subscription to your list and feel the warmth of that digital security blanket?</p>",
		keywords: [
			"NordVPN",
			"digital security",
			"encryption",
			"VPN features",
			"online privacy",
		],
		url: "https://go.nordvpn.net/aff_c?offer_id=658&aff_id=119891",
	},
	{
		title: "NordLocker: Because Who Doesn't Want to Encrypt Their Cat Photos?",
		content:
			"<p>In a world where even your toaster might be plotting against you, NordLocker steps up to encrypt your files with military-grade algorithms. Now, you can securely store your grocery lists and vacation selfies, ensuring that hackers won't discover your secret banana bread recipe. With up to 2 TB of encrypted cloud storage, because who doesn't have terabytes of super-sensitive data lying around? So, why not add another layer of security to your mundane files and feel like a top-secret agent in the process?</p>",
		keywords: [
			"NordLocker",
			"file encryption",
			"cloud storage",
			"data security",
			"online privacy",
		],
		url: "https://go.nordlocker.net/aff_c?offer_id=489&aff_id=119891",
	},
	{
		title: "NordStellar's 'Special' Offer: Because Who Doesn't Want to Monitor the Dark Web for Their Leaked Lunch Menu?",
		content:
			"<p>In today's digital age, where even your smart toaster could be plotting against you, NordStellar swoops in with their 'special' offer to help businesses monitor the dark web for any mention of their name. Because nothing says 'cutting-edge security' like knowing your company's cafeteria menu has been leaked on hacker forums. With features like detecting compromised credentials and scanning for external vulnerabilities, it's the perfect solution for those sleepless nights worrying about cybercriminals targeting your outdated PowerPoint presentations. So, why not dive into the world of proactive threat management and ensure your company's darkest secrets (like that embarrassing team-building karaoke video) stay safe?</p>",
		keywords: [
			"NordStellar",
			"cybersecurity",
			"dark web monitoring",
			"data breach prevention",
			"threat exposure management",
		],
		url: "https://go.nordstellar.net/aff_c?offer_id=927&aff_id=119891",
	},
	{
		title: "NordPass Business: Because Remembering Passwords Is So 1999",
		content:
			"<p>In an era where your smart fridge can order milk but can't remember its own password, NordPass Business swoops in to save the day. Offering seamless password security for your company, it ensures that even your most forgetful employee can access the TPS reports without a hitch. With features like encrypted storage and secure access sharing, it's like having a bouncer for your digital secrets. So, why not let NordPass Business handle your passwords while you focus on more important things, like figuring out how to mute yourself on Zoom?</p>",
		keywords: [
			"NordPass Business",
			"password management",
			"encrypted storage",
			"secure access",
			"digital security",
		],
		url: "https://go.nordpass.io/aff_c?offer_id=754&aff_id=119891",
	},
];

let currentProgramIndex = 0;

export function getRandomAffiliate(): Article {
	let selectedProgram: AffiliateProgram;

	if (programmes.length < 10) {
		// Sequential selection
		selectedProgram = programmes[currentProgramIndex];
		currentProgramIndex = (currentProgramIndex + 1) % programmes.length;
	} else {
		// Random selection
		selectedProgram =
			programmes[Math.floor(Math.random() * programmes.length)];
	}

	const timestamp = Date.now();
	const slugBase = selectedProgram.title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return {
		slug: `${slugBase}-${timestamp}`,
		title: selectedProgram.title,
		content: selectedProgram.content,
		originalUrl: selectedProgram.url,
		publishedAt: new Date(),
		categories: [{ name: "Sponsored", slug: "sponsored" }],
		keywords: selectedProgram.keywords,
		isAffiliate: true,
	};
}
