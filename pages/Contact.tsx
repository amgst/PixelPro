import React from 'react';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    service: 'Graphic Design',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setStatus('submitting');

    try {
      console.log('Sending request to Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'be457400-4579-4076-a279-03b80c86b219',
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          service: formData.service,
          message: formData.message
        })
      });

      const result = await response.json();
      console.log('Web3Forms response:', result);

      if (result.success) {
        setStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          service: 'Graphic Design',
          message: ''
        });
      } else {
        console.error('Web3Forms error:', result);
        setStatus('error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact wbify Creative Studio',
    description: 'Get in touch with wbify Creative Studio for web development, design, and digital marketing services',
    mainEntity: {
      '@type': 'Organization',
      name: 'wbify Creative Studio',
      email: 'wbify.com@gmail.com'
    }
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <SEO
        title="Contact wbify | Start Your Creative Project Today"
        description="Ready to upgrade your digital presence? Get in touch with our team for a free consultation. We're here to answer your questions and kickstart your project."
        canonical="/contact"
        structuredData={contactStructuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Let's Discuss Your Project</h1>
          <p className="text-gray-500">Have a project in mind? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-medium text-slate-900">Email Us</p>
                    <p className="text-gray-500">wbify.com@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested In</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-white"
              >
                <option>Graphic Design</option>
                <option>Web Development</option>
                <option>Digital Marketing</option>
                <option>Video & Animation</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};

export default Contact;