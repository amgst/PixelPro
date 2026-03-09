import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Loader, Search, Sparkles, Tag, User } from 'lucide-react';
import { getBlogPosts, BlogPost } from '../lib/blogService';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string>('All');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await getBlogPosts(true);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const blogStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Wbify Blog',
        description: 'Insights, trends, and practical guides for web design, development, and digital growth',
        url: 'https://www.wbify.com/blog',
        publisher: {
            '@type': 'Organization',
            name: 'Wbify'
        }
    };

    const allTags = ['All', ...Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b))];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredPosts = posts.filter((post) => {
        const matchesTag = activeTag === 'All' || post.tags.includes(activeTag);
        const matchesSearch = normalizedQuery.length === 0 || [
            post.title,
            post.excerpt,
            post.author,
            post.tags.join(' ')
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

        return matchesTag && matchesSearch;
    });

    const featuredPost = filteredPosts[0] ?? null;
    const remainingPosts = featuredPost ? filteredPosts.slice(1) : [];

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-16">
            <SEO
                title="Web Design & Dev Blog | Shopify Tips, Trends & Insights"
                description="Stay ahead with expert insights on E-commerce trends, Shopify tutorials, and web development best practices. Read our latest articles to grow your business."
                canonical="/blog"
                structuredData={blogStructuredData}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white overflow-hidden shadow-2xl">
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
                        <div className="p-8 sm:p-10 lg:p-14">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 mb-6">
                                <Sparkles size={16} />
                                Practical insights for better websites and better content
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                Blog posts built for <span className="text-cyan-300">search, trust, and conversions</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 max-w-2xl">
                                Long-form guides, implementation tips, and growth content for businesses that need more than surface-level advice.
                            </p>
                        </div>

                        <div className="p-8 sm:p-10 lg:p-14 bg-white/5 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/10">
                            <div className="relative mb-5">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search topics, tags, or authors"
                                    className="w-full rounded-2xl border border-white/10 bg-white px-11 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setActiveTag(tag)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                            activeTag === tag
                                                ? 'bg-cyan-300 text-slate-950'
                                                : 'bg-white/10 text-slate-100 hover:bg-white/20'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin text-blue-600" size={40} />
                    </div>
                ) : (
                    <>
                        {featuredPost && (
                            <article className="mb-10 grid overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
                                {featuredPost.image && (
                                    <div className="min-h-[280px] lg:min-h-full">
                                        <img
                                            src={featuredPost.image}
                                            alt={featuredPost.imageAlt || featuredPost.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-8 lg:p-10">
                                    <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                                        Featured article
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(featuredPost.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {featuredPost.author}
                                        </span>
                                        <span>{Math.max(1, Math.ceil(featuredPost.content.split(/\s+/).filter(Boolean).length / 220))} min read</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                                        <Link to={`/blog/${featuredPost.slug}`} className="hover:text-blue-600 transition-colors">
                                            {featuredPost.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {featuredPost.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                            >
                                                <Tag size={10} className="mr-1" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        to={`/blog/${featuredPost.slug}`}
                                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                    >
                                        Read Featured Article
                                        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </article>
                        )}

                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Latest articles</h2>
                                <p className="text-sm text-slate-500">{filteredPosts.length} post{filteredPosts.length === 1 ? '' : 's'} matched your filter</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {remainingPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                                >
                                    {post.image && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.imageAlt || post.title}
                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}

                                    <div className="p-8 flex-grow flex flex-col">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(post.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User size={14} />
                                                {post.author}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors">
                                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>

                                        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                    >
                                                        <Tag size={10} className="mr-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <Link
                                                to={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                            >
                                                Read Article
                                                <ArrowRight
                                                    size={16}
                                                    className="ml-2 transform group-hover:translate-x-1 transition-transform"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                            {filteredPosts.length === 0 && (
                                <div className="col-span-full text-center py-20 text-gray-400">
                                    <p>No blog posts matched your search.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Blog;
