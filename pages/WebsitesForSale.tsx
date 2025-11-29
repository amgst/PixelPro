import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Layout, ShoppingCart, Zap, ArrowRight } from 'lucide-react';

const WebsitesForSale: React.FC = () => {
    const templates = [
        {
            id: 1,
            title: 'Premium Car Rental',
            category: 'Automotive',
            image: '/template_cars.png',
            description: 'A high-end car rental website with fleet showcase and booking inquiry system.',
            features: ['Fleet Gallery', 'Booking Form', 'Service Details'],
            previewLink: 'https://cars-six-rouge.vercel.app/'
        },
        {
            id: 2,
            title: 'Modern Dental Clinic',
            category: 'Healthcare',
            image: '/template_dental.png',
            description: 'Clean and trustworthy design for dental clinics with appointment scheduling.',
            features: ['Appointment Booking', 'Service List', 'Team Profiles'],
            previewLink: 'https://dental-clinic-website-seven.vercel.app/'
        },

        {
            id: 5,
            title: 'SweetTreats & Events Hub',
            category: 'Food & Events',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'A delightful website for bakeries and event planners. Showcase your treats and manage event bookings.',
            features: ['Menu Showcase', 'Event Booking', 'Gallery'],
            previewLink: 'https://sweet-treats-black.vercel.app/'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 rounded-l-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6">
                        Limited Time Offer
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Launch Your Website for <span className="text-blue-400">$100</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Get a professional, fully responsive website launched in 48 hours. No hidden fees, just a flat $100.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#templates" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25">
                            View Templates
                        </a>
                        <Link to="/contact">
                            <button className="px-8 py-4 bg-transparent border border-gray-600 text-white rounded-full font-medium hover:bg-slate-800 transition-all">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Included for $100?</h2>
                        <p className="text-gray-500">We don't just give you a template; we set it up for you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Layout,
                                title: 'Professional Template',
                                desc: 'Choose from our curated collection of high-quality, responsive designs.'
                            },
                            {
                                icon: Zap,
                                title: 'Basic Customization',
                                desc: 'We add your logo, update the color scheme to match your brand, and upload your content.'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Launch Support',
                                desc: 'We handle the technical setup, domain connection, and ensure your site is live.'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Ready Sites?</h2>
                        <p className="text-gray-500">Built with modern technology for speed, security, and growth.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Mobile Responsive',
                                desc: 'Looks perfect on every device, from smartphones to large desktop screens.',
                                icon: '📱'
                            },
                            {
                                title: 'SEO Optimized',
                                desc: 'Built with best practices to help you rank higher on Google search results.',
                                icon: '🔍'
                            },
                            {
                                title: 'Blazing Fast',
                                desc: 'Hosted on Vercel\'s global edge network for instant page loads anywhere.',
                                icon: '🚀'
                            },
                            {
                                title: 'Contact Ready',
                                desc: 'Includes working contact forms so you never miss a customer inquiry.',
                                icon: '✉️'
                            },
                            {
                                title: 'Analytics Included',
                                desc: 'Pre-configured for Google Analytics so you can track your visitors.',
                                icon: '📊'
                            },
                            {
                                title: 'Easy to Update',
                                desc: 'Clean code structure makes it simple to update text and images later.',
                                icon: '✏️'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section id="templates" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Available Templates</h2>
                            <p className="text-gray-500">Select a design to get started.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {templates.map((template) => (
                            <div key={template.id} className="group bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide">
                                        {template.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{template.title}</h3>
                                    <p className="text-gray-500 mb-6">{template.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {template.features.map((feature, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Link to="/contact" className="flex-1">
                                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                                Buy Now <ShoppingCart size={18} />
                                            </button>
                                        </Link>
                                        {template.previewLink ? (
                                            <a href={template.previewLink} target="_blank" rel="noopener noreferrer">
                                                <button className="px-6 py-3 bg-white border border-gray-200 text-slate-900 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                                    Preview
                                                </button>
                                            </a>
                                        ) : (
                                            <button className="px-6 py-3 bg-white border border-gray-200 text-slate-900 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                                Preview
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-slate-50 border-t border-gray-200">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-500">Everything you need to know about your new website.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Is there a monthly fee?",
                                a: "No! We deploy your site on Vercel's Basic plan, which is completely free for personal and hobby projects. You only pay the one-time $100 setup fee."
                            },
                            {
                                q: "Do I need to pay for hosting?",
                                a: "Hosting is free on Vercel as long as you stay within their generous usage limits (which are plenty for most small business sites)."
                            },
                            {
                                q: "Is SSL included?",
                                a: "Yes, a secure SSL certificate (HTTPS) is automatically included for free, keeping your site and visitors safe."
                            },
                            {
                                q: "What do I need to provide?",
                                a: "We'll need you to create a free Vercel account and a free GitHub (or GitLab/Bitbucket) account so we can transfer ownership of the code and project to you."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-slate-900 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't see what you need?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        We also offer fully custom web design and development services tailored to your specific requirements.
                    </p>
                    <Link to="/contact">
                        <button className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
                            Get a Custom Quote
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default WebsitesForSale;
