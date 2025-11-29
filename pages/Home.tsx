import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShoppingBag } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';
import GameFloatingButton from '../components/GameFloatingButton';
import GameModal from '../components/GameModal';

const Home: React.FC = () => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // Take first 4 categories for the preview
  const featuredCategories = SERVICE_CATEGORIES.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>

        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide">
            wbify Creative Studio
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            Expert Shopify, Web & <br /><span className="text-blue-600">Graphics Services</span> in One Place.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From high-converting Shopify stores to custom web applications and stunning brand visuals. We are your complete digital partner.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/services">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Browse All Services <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/contact">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-gray-200 rounded-full font-medium hover:border-slate-300 hover:bg-gray-50 transition-all">
                Get a Quote
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Services</h2>
            <p className="text-gray-500">Everything you need to build, market, and manage your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <div key={cat.id} className="group p-8 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-transparent transition-all duration-300 bg-white">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{cat.description}</p>
                <Link to="/services" className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1">
                  View {cat.services.length} services <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center text-slate-900 font-semibold border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">
              View Full Service Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Shopify Highlight Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 rounded-l-full blur-3xl -mr-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                <ShoppingBag size={16} />
                <span>E-Commerce Experts</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Launch Your Dream Store with <span className="text-blue-400">Shopify</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                We specialize in building high-converting Shopify stores. From custom theme development to payment integration and app setup, we handle everything to get you selling online fast.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {['Custom Theme Design', 'Store Setup & Migration', 'App Integration', 'Conversion Optimization'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-200">
                    <CheckCircle size={18} className="text-blue-400" /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/shopify">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25">
                    Start Your Shopify Project
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="relative z-10 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 h-4 w-32 bg-slate-700 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-40 bg-slate-700/50 rounded-lg animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
                    <div className="h-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
                    <div className="h-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why businesses trust wbify.</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                We combine the extensive variety of a freelance marketplace with the reliability, quality, and support of a professional agency.
              </p>

              <div className="space-y-4">
                {[
                  "Specialized in Shopify & Custom Web Dev",
                  "Verified Experts & Fast Turnaround Times",
                  "Transparent Pricing & No Hidden Fees",
                  "Dedicated Support for Every Project"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0" size={20} />
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://picsum.photos/400/500?random=1" alt="Office" className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" />
                <img src="https://picsum.photos/400/500?random=2" alt="Team" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Floating Button & Modal */}
      <GameFloatingButton onClick={() => setIsGameModalOpen(true)} />
      <GameModal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} />

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Ready to start your project?</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Join hundreds of satisfied clients who have streamlined their creative needs with us.</p>
          <Link to="/contact">
            <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Contact Us Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;