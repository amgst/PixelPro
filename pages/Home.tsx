import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';

const Home: React.FC = () => {
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
            PixelPro Creative Studio
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            All Your Creative, Print & <br/><span className="text-blue-600">Digital Services</span> in One Place.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From logo design and printing to web development and digital marketing. We are your complete creative partner for business growth.
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

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why businesses trust PixelPro.</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                We combine the extensive variety of a freelance marketplace with the reliability, quality, and support of a professional agency.
              </p>
              
              <div className="space-y-4">
                {[
                  "One-Stop Shop: Print, Web, Design & Marketing",
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