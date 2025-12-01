import React, { useEffect, useState } from 'react';
import { ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tool, TOOLS_SEED_DATA, getIconByName } from '../data/toolsData';

const Tools: React.FC = () => {
    const [tools, setTools] = useState<Tool[]>([]);

    useEffect(() => {
        // Load tools from LocalStorage or use seed data
        const storedTools = localStorage.getItem('wbify_tools_v2');
        if (storedTools) {
            setTools(JSON.parse(storedTools));
        } else {
            setTools(TOOLS_SEED_DATA);
            localStorage.setItem('wbify_tools_v2', JSON.stringify(TOOLS_SEED_DATA));
        }
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-50 py-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide mb-4">
                        Useful Resources
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Tools</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        A collection of handy tools to help you with your digital projects.
                    </p>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {tools.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No tools available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tools.map((tool) => {
                                const Icon = getIconByName(tool.iconName);
                                return (
                                    <div key={tool.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{tool.name}</h3>
                                        <p className="text-gray-500 mb-6 min-h-[48px]">
                                            {tool.description}
                                        </p>
                                        <a
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
                                        >
                                            Open Tool <ArrowRight size={16} />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-16 text-center">
                        <Link to="/" className="text-gray-500 hover:text-slate-900 font-medium transition-colors">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tools;
