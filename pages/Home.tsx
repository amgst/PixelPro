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
            </div >

  <div className="relative">
    <div className="grid grid-cols-2 gap-4">
      <img src="https://picsum.photos/400/500?random=1" alt="Office" className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" />
      <img src="https://picsum.photos/400/500?random=2" alt="Team" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
    </div>
  </div>
          </div >
        </div >
      </section >

  {/* Game Floating Button & Modal */ }
  < GameFloatingButton onClick = {() => setIsGameModalOpen(true)} />
    < GameModal isOpen = { isGameModalOpen } onClose = {() => setIsGameModalOpen(false)} />

{/* CTA Section */ }
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
    </div >
  );
};

export default Home;