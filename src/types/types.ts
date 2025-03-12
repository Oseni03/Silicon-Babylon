// Article Related Types
export interface Category {
	name: string;
	slug: string;
}

export interface Article {
	slug: string;
	title: string;
	content: string;
	originalUrl: string;
	originalTitle?: string;
	publishedAt: Date;
	categories: Category[];
	keywords: string[];
}

export interface ArticleCardProps {
	title: string;
	excerpt: string;
	date: string;
	category: string;
	index: number;
	slug: string;
}

// API Response Types
export interface SatiricalResult {
	title: string;
	content: string;
	keywords: string[];
}

export interface TechCrunchItem {
	title: string;
	link: string;
	content: string;
	isoDate: string;
	categories: string[];
}
