import React from 'react';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Get In Touch</h1>
          <p className="text-gray-500">Have a project in mind? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Our Studio</p>
                    <p className="text-gray-500">123 Creative Avenue, Design District<br/>Sydney, NSW 2000, Australia</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Email Us</p>
                    <p className="text-gray-500">hello@pixelpro.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Call Us</p>
                    <p className="text-gray-500">+61 (02) 1234 5678</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={20} /> Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white">
                <option>Graphic Design</option>
                <option>Web Development</option>
                <option>Digital Marketing</option>
                <option>Video & Animation</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Tell us about your project..."></textarea>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
              Send Message
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;