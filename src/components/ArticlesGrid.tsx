import React from 'react'
import ArticleCard from './ArticleCard'
import { type Article } from '@/types/types'

const ArticlesGrid = ({ filteredArticles }: { filteredArticles: Article[] }) => {
    return (
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
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        {/* ... existing no results UI code ... */}
                    </div>
                )
            }
        </ div>
    )
}

export default ArticlesGrid