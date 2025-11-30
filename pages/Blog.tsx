import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
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

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        setPosts(blogData);
    }, []);

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Our <span className="text-blue-600">Blog</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Insights, trends, and tips from the world of web design and development.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                            {post.image && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
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
                </div>
            </div>
        </div>
    );
};

export default Blog;
