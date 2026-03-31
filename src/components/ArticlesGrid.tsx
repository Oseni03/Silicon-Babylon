import React from 'react'
import ArticleCard from './ArticleCard'
import { type Article } from '@/types/types'
import AnimatedSection from './AnimatedSection'

const ArticlesGrid = ({ filteredArticles }: { filteredArticles: Article[] }) => {
    return (
        <AnimatedSection direction="none" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {
                    filteredArticles.length > 0 ? (
                        filteredArticles.map((article, index) => (
                            <ArticleCard
                                key={`${article.slug}-${index}`}
                                title={article.title}
                                excerpt={article.description || article.content.substring(0, 200) + "..."}
                                date={new Date(article.publishedAt).toISOString()}
                                categories={article.categories}
                                index={index}
                                slug={article.slug}
                                isAffiliate={article.isAffiliate}
                                originalUrl={article.originalUrl}
                                image={article.image}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">No articles found in this category.</p>
                        </div>
                    )
                }
            </div>
        </AnimatedSection>
    )
}

export default ArticlesGrid