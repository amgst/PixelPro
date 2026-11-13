import React from 'react';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from './SettingsProvider';

export default function ConsultationOptions() {
  const { settings } = useSettings();
  let bookingUrl = '';
  try {
    const url = new URL(settings.bookingUrl || '');
    if (url.protocol === 'https:') bookingUrl = url.href;
  } catch { /* A calendar is optional until configured. */ }
  const number = (settings.whatsappNumber || '').replace(/[\s()+.-]/g, '');
  const whatsappUrl = /^[1-9]\d{6,14}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hi Wbify, I'd like to discuss a project.")}`
    : '';

  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8" aria-labelledby="consultation-heading">
      <Calendar className="text-blue-600 mb-4" size={28} />
      <h2 id="consultation-heading" className="text-2xl font-bold text-slate-900 mb-3">Let's talk about your next project</h2>
      <p className="text-gray-600 mb-6">Tell us what you want to build. We'll discuss your goals, scope, and next steps in a free discovery call.</p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {bookingUrl ? (
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700">Book a discovery call <ArrowRight size={18} /></a>
        ) : (
          <Link to="/contact?consultation=1#contact-form" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700">Request a discovery call <ArrowRight size={18} /></Link>
        )}
        {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-6 py-3 text-green-800 font-semibold hover:bg-green-50"><MessageCircle size={18} />Chat on WhatsApp</a>}
      </div>
      {!bookingUrl && <p className="mt-3 text-sm text-gray-500">Send your preferred times through our contact form and we'll arrange a call.</p>}
    </section>
  );
}
