import React from 'react';
import { Heart, Users, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="h-[400px] w-full relative">

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