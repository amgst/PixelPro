import React from 'react';
import { Heart, Users, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="h-[400px] w-full relative">
         <img 
           src="https://picsum.photos/1920/600?grayscale" 
           alt="Studio" 
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">About PixelPro</h1>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* Story */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-500">
            <p className="mb-4">
              Founded in 2023, PixelPro Creative Studio began with a simple idea: High-quality creative services shouldn't be complicated or prohibitively expensive. We saw a gap between impersonal freelance marketplaces and overpriced traditional agencies.
            </p>
            <p>
              We set out to create a hybrid model—a digital studio that offers the variety and affordability of a platform like Fiverr, but with the quality assurance, communication, and reliability of a boutique agency. Today, we are a distributed team of over 50 creatives, developers, and strategists working together to help businesses thrive in the digital age.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-6 border border-gray-100 rounded-xl bg-slate-50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
              <Heart size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Passion</h3>
            <p className="text-sm text-gray-500">We love what we do, and it shows in every pixel and line of code.</p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-xl bg-slate-50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Collaboration</h3>
            <p className="text-sm text-gray-500">We work with you, not just for you. Your vision drives our process.</p>
          </div>
          <div className="text-center p-6 border border-gray-100 rounded-xl bg-slate-50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Efficiency</h3>
            <p className="text-sm text-gray-500">Fast turnaround times without ever compromising on quality.</p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-slate-900 text-white rounded-3xl p-12 text-center">
           <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
           <p className="text-xl text-slate-300 italic">
             "To empower businesses of all sizes with world-class creative and digital solutions, making professional design and technology accessible to everyone."
           </p>
        </div>

      </div>
    </div>
  );
};

export default About;