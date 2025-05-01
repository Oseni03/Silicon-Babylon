import React from 'react'
import { siteName } from '@/lib/config'
import Link from 'next/link'

export const Logo = () => {
    return (
        <div className="flex md:items-center justify-center my-4">
            <Link href="/" className="flex flex-col items-center group">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform mr-2">
                        <span className="text-primary-foreground font-bold text-xl">
                            S
                        </span>
                    </div>
                    <span className="font-bold text-3xl tracking-tight">
                        {siteName}
                    </span>
                </div>
                <span className="text-sm text-muted-foreground italic mt-1">
                    Probably Accurate News, Most of the Time
                </span>
            </Link>
        </div>
    )
}
