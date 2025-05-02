"use client"

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { siteName } from '@/lib/config'
import { Loader2 } from 'lucide-react'

function UnsubscribeContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [loading, setLoading] = useState(true)
    const [unsubscribed, setUnsubscribed] = useState(false)

    useEffect(() => {
        const unsubscribe = async () => {
            if (!email) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch("/api/newsletter/unsubscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    throw new Error("Failed to unsubscribe");
                }

                setUnsubscribed(true)
                toast("Successfully unsubscribed!", {
                    description: "We'll miss you... but we'll try not to stalk your inbox.",
                    action: {
                        label: "Undo",
                        onClick: async () => {
                            await subscribeToNewsletter(email)
                            setUnsubscribed(false)
                            toast("Successfully subscribed! 🎉", {
                                description: "Welcome back! We promise to only send you the most ridiculous tech news.",
                            });
                        }
                    },
                });
            } catch (error) {
                toast.error("Unsubscribing failed", {
                    description: "Our unsubscribe button seems to be as broken as our tech predictions."
                });
            } finally {
                setLoading(false);
            }
        };

        unsubscribe()
    }, [email])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {unsubscribed ? "You're Free!" : "Breaking Up is Hard to Do"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {unsubscribed
                            ? "You've successfully escaped our newsletter. Your inbox will now be 99.9% less ridiculous."
                            : "We're processing your request to leave our absurd tech news behind..."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Unsubscribing you from our digital nonsense...
                            </p>
                        </div>
                    ) : unsubscribed ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Don't worry, we won't take it personally.
                                (Okay, maybe a little...)
                            </p>
                            <div className="text-xs text-muted-foreground">
                                <p>Your email: {email}</p>
                                <p>Status: Successfully unsubscribed</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Something went wrong. Maybe the universe wants you to stay?
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Return to {siteName}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    )
}