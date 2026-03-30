import React from 'react'
import { siteName } from '@/lib/config'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className={cn("flex flex-col items-center md:items-start group", className)}>
            <span className="font-serif text-4xl md:text-5xl tracking-tighter hover:opacity-80 transition-opacity">
                {siteName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                Probably Accurate News
            </span>
        </Link>
    )
}
