import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, LayoutTemplate, Package, Plug, ShoppingBag } from 'lucide-react';
import ShopProductCard from './ShopProductCard';
import { Product, SHOP_CATEGORIES, ShopCategoryId, getShopCategoryId } from '../data/productsData';
import { getProducts } from '../lib/productsService';

const CATEGORY_ICONS: Record<ShopCategoryId, React.ElementType> = {
  'wordpress-themes': LayoutTemplate,
  'wordpress-plugins': Plug,
  'shopify-themes': ShoppingBag,
  'shopify-apps': Blocks,
  others: Package,
};

const ShopPreview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data.filter(p => p.status !== 'archived')))
      .catch(e => console.error('Error fetching shop products', e));
  }, []);

  const counts = useMemo(() => {
    const result = {} as Record<ShopCategoryId, number>;
    SHOP_CATEGORIES.forEach(c => (result[c.id] = 0));
    products.forEach(p => result[getShopCategoryId(p.category)]++);
    return result;
  }, [products]);

  const categories = SHOP_CATEGORIES.filter(c => c.id !== 'others' || counts.others > 0);
  const latest = products.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
              Wbify Shop
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Themes & Plugins</h2>
            <p className="text-gray-500 max-w-xl">
              Ready-made WordPress and Shopify themes and plugins from our team, so you can launch faster.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-slate-900 font-semibold border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all self-start md:self-auto"
          >
            Visit the Shop <ArrowRight size={16} />
          </Link>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${categories.length > 4 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          {categories.map(c => {
            const Icon = CATEGORY_ICONS[c.id];
            return (
              <Link
                key={c.id}
                to={`/shop?category=${c.id}`}
                className="group p-6 border border-gray-100 rounded-2xl hover:shadow-xl hover:border-transparent transition-all duration-300 bg-white flex flex-col"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{c.label}</h3>
                <p className="text-sm text-gray-500 mb-5 flex-1">{c.description}</p>
                <span className="text-blue-600 font-medium text-sm flex items-center gap-1">
                  {counts[c.id] > 0 ? `Browse ${counts[c.id]} ${counts[c.id] === 1 ? 'product' : 'products'}` : 'Browse'}
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>

        {latest.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Latest in the Shop</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latest.map(product => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopPreview;
