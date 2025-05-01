import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Button,
    Hr,
    Column,
    Row,
} from '@react-email/components';
import { type Article } from '@/types/types';
import { stripHtml } from '@/lib/utils/xml';
import { siteName, siteUrl } from '@/lib/config';

const BulkByteNewsletter = (articles: Article[], email: string) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Html>
            <Tailwind>
                <Head>
                    <title>{siteName}</title>
                    <Preview>The only tech news that's intentionally ridiculous</Preview>
                </Head>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
                        {/* Header with Logo */}
                        <Section className="mt-[10px]">
                            <Row>
                                <Column className="text-center">
                                    <div className="flex items-center justify-center">
                                        {/* Logo: White S in Black Box with rounded edges */}
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'black',
                                            borderRadius: '8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '10px'
                                        }}>
                                            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', lineHeight: '1' }}>S</div>
                                        </div>

                                        <Heading className="text-[32px] font-bold text-black my-[16px] inline-block">
                                            <span className="text-black">{siteName}</span>
                                        </Heading>
                                    </div>

                                    <Text className="text-center text-gray-700 text-[16px] italic">
                                        The only tech news that's intentionally ridiculous
                                    </Text>
                                    <Text className="text-center text-gray-500 text-[14px]">
                                        Bulk-Byte Edition • {currentDate}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr className="border-gray-200 my-[20px]" />

                        {/* Top Stories */}
                        <Section>
                            <Heading className="text-[20px] font-bold text-black mb-[16px]">
                                This Week's Top Absurdities
                            </Heading>

                            {articles.slice(0, 4).map((article) =>
                                <>
                                    <Row>
                                        <Column>
                                            <Text className="font-bold text-[16px] text-black mb-[8px]">
                                                {article.title}
                                            </Text>
                                            <Text className="text-gray-800 mb-[16px]">
                                                {article.description || stripHtml(article.content.substring(0, 100))}
                                            </Text>
                                            <Link href={`${siteUrl}/article/${article.slug}`} className="text-black underline">
                                                Read the full gist →
                                            </Link>
                                        </Column>
                                    </Row>

                                    <Hr className="border-gray-200 my-[16px]" />
                                </>
                            )}
                        </Section>

                        {/* Ad Placement */}
                        <Section className="my-[24px] bg-gray-100 p-[16px] rounded-[8px] border-[2px] border-gray-300">
                            <Text className="text-[12px] text-gray-500 text-center mb-[8px]">SPONSORED CONTENT</Text>
                            <Heading className="text-[18px] font-bold text-center text-black mb-[12px]">
                                Tired of Software That Actually Works?
                            </Heading>
                            <Text className="text-gray-800 mb-[16px] text-center">
                                Try <span className="font-bold">BugifyPro™</span> - We intentionally add bugs to your perfectly functioning code!
                            </Text>
                            <Text className="text-gray-800 mb-[16px] text-center italic">
                                "After using BugifyPro, our developers finally have job security!" - Anonymous CTO
                            </Text>
                            <Button
                                href="https://example.com/bugifypro"
                                className="bg-black text-white font-bold py-[12px] px-[20px] rounded-[4px] text-center block w-full box-border"
                            >
                                Sabotage Your Software Today!
                            </Button>
                        </Section>

                        <Hr className="border-gray-200 my-[20px]" />

                        {/* More Articles */}
                        <Section>
                            <Heading className="text-[20px] font-bold text-black mb-[16px]">
                                More Digital Delusions
                            </Heading>

                            {articles.slice(4, 8).map((article) =>
                                <>
                                    <Row>
                                        <Column>
                                            <Text className="font-bold text-[16px] text-black mb-[8px]">
                                                {article.title}
                                            </Text>
                                            <Text className="text-gray-800 mb-[16px]">
                                                {article.description || stripHtml(article.content.substring(0, 100))}
                                            </Text>
                                            <Link href={`${siteUrl}/article/${article.slug}`} className="text-black underline">
                                                Read the full gist →
                                            </Link>
                                        </Column>
                                    </Row>

                                    <Hr className="border-gray-200 my-[16px]" />
                                </>
                            )}
                        </Section>

                        <Hr className="border-gray-200 my-[20px]" />

                        {/* Quote of the Week */}
                        <Section className="bg-gray-100 p-[16px] rounded-[8px]">
                            <Text className="text-[18px] italic text-black text-center">
                                "We've created an algorithm that predicts what you'll have for lunch tomorrow with 99% accuracy. Unfortunately, it only works for people who eat the same thing every day."
                            </Text>
                            <Text className="text-right text-gray-700 font-bold">
                                — Dr. Obvious, Chief Data Scientist at PredictableLabs
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-[20px]" />

                        {/* Tech Tip */}
                        <Section>
                            <Heading className="text-[18px] font-bold text-black mb-[12px]">
                                💡 Useless Tech Tip of the Week
                            </Heading>
                            <Text className="text-gray-800 bg-gray-100 p-[12px] rounded-[4px]">
                                To save battery life on your smartphone, simply mail it to someone who has electricity. Your battery will thank you for the break.
                            </Text>
                        </Section>

                        {/* Second Ad Placement */}
                        <Section className="my-[24px] bg-black p-[16px] rounded-[8px]">
                            <Text className="text-[12px] text-gray-400 text-center mb-[8px]">ADVERTISEMENT</Text>
                            <Heading className="text-[18px] font-bold text-center text-white mb-[12px]">
                                Introducing the Anti-Productivity Suite
                            </Heading>
                            <Text className="text-gray-300 mb-[16px] text-center">
                                Our software guarantees to reduce your productivity by at least 73% or your money back!
                            </Text>
                            <Text className="text-gray-300 mb-[12px] text-center">
                                Features include:
                            </Text>
                            <Text className="text-gray-300 mb-[4px] text-center">• Random computer freezes during important meetings</Text>
                            <Text className="text-gray-300 mb-[4px] text-center">• Auto-delete of documents you forgot to save</Text>
                            <Text className="text-gray-300 mb-[16px] text-center">• Wi-Fi that only works when your boss isn't looking</Text>
                            <Button
                                href="https://example.com/anti-productivity"
                                className="bg-white text-black font-bold py-[12px] px-[20px] rounded-[4px] text-center block w-full box-border"
                            >
                                Procrastinate Now (Or Later)
                            </Button>
                        </Section>

                        <Hr className="border-gray-200 my-[20px]" />

                        {/* Call to Action */}
                        <Section className="text-center">
                            <Heading className="text-[20px] font-bold text-black mb-[16px]">
                                Want More Digital Nonsense?
                            </Heading>
                            <Text className="text-gray-800 mb-[16px]">
                                Share this newsletter with your technically challenged friends and watch them believe it's all real!
                            </Text>
                            <div className="flex flex-col gap-4">
                                <Button
                                    href={`mailto:?subject=Check out this ridiculous tech newsletter&body=I found this hilarious tech newsletter that you might enjoy: ${siteUrl}/newsletter`}
                                    className="bg-black text-white font-bold py-[12px] px-[20px] rounded-[4px] text-center inline-block box-border"
                                >
                                    📧 Share via Email
                                </Button>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        href={`https://twitter.com/intent/tweet?text=Check out this hilarious tech newsletter: ${siteUrl}/newsletter&hashtags=tech,newsletter`}
                                        className="bg-[#1DA1F2] text-white font-bold py-[12px] px-[20px] rounded-[4px] text-center inline-block box-border"
                                    >
                                        𝕏 Share on X
                                    </Button>
                                    <Button
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${siteUrl}/newsletter`}
                                        className="bg-[#0077B5] text-white font-bold py-[12px] px-[20px] rounded-[4px] text-center inline-block box-border"
                                    >
                                        💼 Share on LinkedIn
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <Text className="text-gray-600 text-sm">
                                        Or copy this link to share anywhere:
                                    </Text>
                                    <Text className="text-black font-mono text-sm break-all">
                                        {siteUrl}/newsletter
                                    </Text>
                                </div>
                            </div>
                        </Section>

                        <Hr className="border-gray-200 my-[20px]" />

                        {/* Footer */}
                        <Section>
                            <Text className="text-center text-gray-500 text-[14px] m-0">
                                © {new Date().getFullYear()} {siteName} - Where tech news is deliberately ridiculous
                            </Text>
                            <Text className="text-center text-gray-500 text-[14px] m-0">
                                123 Fake Street, Nonexistent City, Digital World
                            </Text>
                            <Text className="text-center text-gray-500 text-[14px] mt-[8px]">
                                <Link href={`${siteUrl}/unsubscribe?email=${email}`} className="text-gray-500 underline">
                                    Unsubscribe
                                </Link>{' '}
                                (but why would you want to?)
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BulkByteNewsletter;