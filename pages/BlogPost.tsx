import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Copy, List, Loader, Share2, Tag, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../components/SEO';
import { getBlogPostBySlug, BlogPost as BlogPostType } from '../lib/blogService';

const slugifyHeading = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

const extractHeadings = (content: string) =>
    content
        .split('\n')
        .filter((line) => /^##\s+/.test(line) || /^###\s+/.test(line))
        .map((line) => {
            const level = line.startsWith('### ') ? 3 : 2;
            const text = line.replace(/^###?\s+/, '').trim();
            return { id: slugifyHeading(text), level, text };
        });

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            if (slug) {
                try {
                    const foundPost = await getBlogPostBySlug(slug);
                    if (foundPost) {
                        setPost(foundPost);
                    } else {
                        navigate('/blog');
                    }
                } catch (error) {
                    console.error('Error fetching blog post:', error);
                    navigate('/blog');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchPost();
    }, [slug, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            const article = document.getElementById('blog-article-content');
            if (!article) return;

            const rect = article.getBoundingClientRect();
            const articleTop = window.scrollY + rect.top;
            const scrollableHeight = article.offsetHeight - window.innerHeight;

            if (scrollableHeight <= 0) {
                setReadingProgress(100);
                return;
            }

            const progress = ((window.scrollY - articleTop) / scrollableHeight) * 100;
            setReadingProgress(Math.min(Math.max(progress, 0), 100));
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [post]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!post) {
        return null;
    }

    const readingMinutes = Math.max(1, Math.ceil(post.content.split(/\s+/).filter(Boolean).length / 220));
    const headings = extractHeadings(post.content);

    const articleStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image || 'https://www.wbify.com/favicon.ico',
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Organization',
            name: post.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'Wbify',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.wbify.com/favicon.ico'
            }
        },
        keywords: post.tags.join(', ')
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-slate-200/70">
                <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-slate-900 transition-[width] duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <SEO
                title={post.title}
                description={post.excerpt}
                canonical={`/blog/${post.slug}`}
                image={post.image}
                type="article"
                publishedTime={post.date}
                author={post.author}
                tags={post.tags}
                structuredData={articleStructuredData}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                <article className="bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
                    <div>
                        <header className="mb-12">
                            {post.image && (
                                <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl h-64 md:h-[500px] w-full relative">
                                    <img
                                        src={post.image}
                                        alt={post.imageAlt || post.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
                                <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                                    <Calendar size={16} />
                                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full font-medium">
                                    <User size={16} />
                                    {post.author}
                                </span>
                                <span className="text-gray-500 text-sm">{readingMinutes} min read</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                                {post.title}
                            </h1>

                            {post.excerpt && (
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light italic border-l-4 border-blue-500 pl-6">
                                    {post.excerpt}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-10">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                                    >
                                        <Tag size={12} className="mr-1.5" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </header>

                        <div
                            id="blog-article-content"
                            className="prose prose-lg prose-slate max-w-none
                                prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
                                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-slate-800
                                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-slate-800
                                prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-6
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                                prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-ul:my-6 prose-ul:space-y-2
                                prose-ol:my-6 prose-ol:space-y-2
                                prose-li:text-gray-700 prose-li:leading-relaxed
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700 prose-blockquote:italic
                                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                                prose-pre:bg-slate-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg
                                prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8 prose-img:w-full
                                prose-hr:my-12 prose-hr:border-gray-200
                                prose-table:w-full prose-table:my-8 prose-table:border-collapse
                                prose-th:bg-gray-50 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900
                                prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-slate-900 mb-6 mt-12 pb-4 border-b border-gray-200" {...props} />,
                                    h2: ({node, children, ...props}) => (
                                        <h2 id={slugifyHeading(String(children).trim())} className="scroll-mt-28 text-3xl font-bold text-slate-800 mb-4 mt-10" {...props}>
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({node, children, ...props}) => (
                                        <h3 id={slugifyHeading(String(children).trim())} className="scroll-mt-28 text-2xl font-bold text-slate-800 mb-3 mt-8" {...props}>
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({node, ...props}) => <h4 className="text-xl font-bold text-slate-800 mb-2 mt-6" {...props} />,
                                    p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />,
                                    ul: ({node, ...props}) => <ul className="my-6 space-y-3 list-disc list-inside" {...props} />,
                                    ol: ({node, ...props}) => <ol className="my-6 space-y-3 list-decimal list-inside" {...props} />,
                                    li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed ml-4" {...props} />,
                                    blockquote: ({node, ...props}) => (
                                        <blockquote className="border-l-4 border-blue-500 bg-blue-50 py-4 px-6 my-8 rounded-r-lg text-gray-700 italic" {...props} />
                                    ),
                                    code: ({node, inline, children, ...props}: any) => inline ? (
                                        <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-slate-900 text-gray-100 rounded-xl p-6 overflow-x-auto shadow-lg my-8">
                                            <code className="text-sm font-mono" {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ),
                                    img: ({node, ...props}: any) => <img className="rounded-2xl shadow-xl my-8 w-full" {...props} />,
                                    a: ({node, ...props}: any) => <a className="text-blue-600 font-semibold hover:text-blue-700 no-underline hover:underline" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-slate-900 font-bold" {...props} />,
                                    hr: ({node, ...props}) => <hr className="my-12 border-gray-200" {...props} />,
                                    table: ({node, ...props}: any) => (
                                        <div className="overflow-x-auto my-8">
                                            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden" {...props} />
                                        </div>
                                    ),
                                    thead: ({node, ...props}: any) => <thead className="bg-gray-50" {...props} />,
                                    tbody: ({node, ...props}: any) => <tbody {...props} />,
                                    tr: ({node, ...props}: any) => <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors" {...props} />,
                                    th: ({node, ...props}: any) => (
                                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-slate-900 bg-gray-50" {...props} />
                                    ),
                                    td: ({node, ...props}: any) => (
                                        <td className="border border-gray-300 px-4 py-3 text-gray-700" {...props} />
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-16 pt-12 border-t-2 border-gray-200">
                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 mb-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">About the Author</h3>
                                        <p className="text-gray-600">{post.author}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Share this article</h3>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: post.title,
                                                            text: post.excerpt,
                                                            url: window.location.href
                                                        });
                                                    } else {
                                                        navigator.clipboard.writeText(window.location.href);
                                                        alert('Link copied to clipboard!');
                                                    }
                                                }}
                                                className="p-3 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                                                title="Share"
                                            >
                                                <Share2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    alert('Link copied to clipboard!');
                                                }}
                                                className="p-3 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                                                title="Copy link"
                                            >
                                                <Copy size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                                    Let's bring your vision to life. Get in touch with us today for a free consultation.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/contact-us"
                                        className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Contact Us
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
                                    >
                                        View Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">
                                    <List size={16} />
                                    On this page
                                </div>
                                {headings.length > 0 ? (
                                    <nav className="space-y-3">
                                        {headings.map((heading) => (
                                            <a
                                                key={heading.id}
                                                href={`#${heading.id}`}
                                                className={`block text-sm text-slate-600 hover:text-blue-600 transition-colors ${heading.level === 3 ? 'pl-4' : ''}`}
                                            >
                                                {heading.text}
                                            </a>
                                        ))}
                                    </nav>
                                ) : (
                                    <p className="text-sm text-slate-500">Add `##` and `###` headings in the post to generate a table of contents.</p>
                                )}
                            </div>

                            <div className="rounded-3xl bg-slate-950 p-6 text-white">
                                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 mb-2">Article stats</p>
                                <p className="text-3xl font-bold mb-2">{readingMinutes} min</p>
                                <p className="text-sm text-slate-300 mb-4">Estimated reading time for a full pass through the article.</p>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-cyan-300 transition-[width] duration-150" style={{ width: `${readingProgress}%` }} />
                                </div>
                                <p className="mt-3 text-xs text-slate-400">{Math.round(readingProgress)}% read</p>
                            </div>
                        </div>
                    </aside>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
