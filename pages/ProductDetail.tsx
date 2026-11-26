import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Loader, Tag, ArrowLeft, CheckCircle, ExternalLink, Package, Send } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from 'react-helmet-async';
import { Product, getShopCategory, getShopCategoryId, normalizeProductUrl } from '../data/productsData';
import { getProductById } from '../lib/productsService';
import { submitOrder } from '../lib/ordersService';
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from '../lib/productImage';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (e) {
        console.error('Error loading product', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value || '1', 10)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!formData.customerName || !formData.email) {
      setFormError('Name and email are required.');
      return;
    }
    if (!recaptchaToken) {
      setFormError('Please complete the reCAPTCHA.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await submitOrder({
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        items: [
          {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price || 0,
            quantity: formData.quantity,
          },
        ],
      });

      // Send email via Vercel API
      console.log('Sending email notification...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'order',
            data: {
              ...formData,
              productName: product.name,
              productSku: product.sku
            },
            recaptchaToken: recaptchaToken
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          console.warn('Email API error:', response.status);
        }
      } catch (emailError) {
        clearTimeout(timeoutId);
        console.warn('Email API request failed:', emailError);
      }

      setSubmitted(true);
      
      // Reset reCAPTCHA
      setRecaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        quantity: 1,
        notes: '',
      });
    } catch (err) {
      console.error('Error submitting order', err);
      setFormError('Failed to send your request. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const pageTitle = `${product.name} | Wbify`;
  const description = product.shortDescription || product.description;

  const externalUrl = normalizeProductUrl(product.productUrl);

  const categoryId = getShopCategoryId(product.category);
  const productKind =
    categoryId === 'shopify-apps' ? 'app'
      : categoryId === 'wordpress-plugins' ? 'plugin'
      : categoryId === 'wordpress-themes' || categoryId === 'shopify-themes' ? 'theme'
      : 'product';
  const platform =
    categoryId.startsWith('shopify') ? 'Shopify store'
      : categoryId.startsWith('wordpress') ? 'WordPress site'
      : 'website';

  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.wbify.com/shop/${product.id}`} />
      </Helmet>

      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/shop" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft size={16} className="mr-1" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
            {product.image ? (
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
                }}
              />
            ) : (
              <Package size={48} className="text-slate-400" />
            )}
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                <Tag size={12} className="mr-1" />
                {getShopCategory(product.category).label}
              </span>
              {product.sku && (
                <span className="text-xs text-gray-500">SKU: {product.sku}</span>
              )}
            </div>
            <p className="text-lg text-gray-600 mb-4">{product.shortDescription}</p>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {externalUrl && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">Get {product.name}</h2>
                  {product.price ? (
                    <p className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
                  ) : null}
                </div>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Get it now
                  <ExternalLink size={16} />
                </a>
                <p className="text-xs text-gray-500">
                  Opens {new URL(externalUrl).hostname.replace(/^www\./, '')} in a new tab.
                </p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Need {productKind === 'app' ? 'an' : 'a'} {productKind} like this?
                </h2>
                <p className="text-sm text-gray-600">
                  We can set this up for you, customise it, or build a similar {productKind} for your {platform}.
                  Tell us what you need and the Wbify team will get back to you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">What do you need?</label>
                  <textarea
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder={`Your ${platform} URL, the features you want and your timeline.`}
                  />
                </div>

                <div className="flex justify-center my-4">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send request
                      <Send size={16} />
                    </>
                  )}
                </button>

                {submitted && (
                  <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
                    <CheckCircle size={14} className="mt-0.5" />
                    <p>Thanks! Your request has been sent to the Wbify team. We will get back to you shortly.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
