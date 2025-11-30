import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import blogData from '../data/blog-posts.json';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    tags: string[];
    image?: string;
}

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        const foundPost = blogData.find((p) => p.slug === slug);
        if (foundPost) {
            setPost(foundPost);
        } else {
            navigate('/blog');
        }
    }, [slug, navigate]);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <Helmet>
                <title>{post.title} | PixelPro Blog</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                <article>
                    <header className="mb-10">
                        {post.image && (
                            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg h-64 md:h-96 w-full">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                <Calendar size={14} />
                                {new Date(post.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                <User size={14} />
                                {post.author}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                                >
                                    <Tag size={12} className="mr-1.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-gray-500 text-sm">
                            Share this article
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
