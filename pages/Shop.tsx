import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, Loader, Package } from 'lucide-react';
import SEO from '../components/SEO';
import ShopProductCard from '../components/ShopProductCard';
import { Product, SHOP_CATEGORIES, ShopCategoryId, getShopCategoryId } from '../data/productsData';
import { getProducts } from '../lib/productsService';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const activeCategory = SHOP_CATEGORIES.some(c => c.id === categoryParam)
    ? (categoryParam as ShopCategoryId)
    : null;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data.filter(p => p.status !== 'archived'));
      } catch (e) {
        console.error('Error fetching products', e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productsByCategory = useMemo(() => {
    const groups = new Map<ShopCategoryId, Product[]>();
    SHOP_CATEGORIES.forEach(c => groups.set(c.id, []));
    products.forEach(p => groups.get(getShopCategoryId(p.category))!.push(p));
    return groups;
  }, [products]);

  // "Others" only shows up when something is filed under it.
  const visibleCategories = SHOP_CATEGORIES.filter(
    c => c.id !== 'others' || productsByCategory.get('others')!.length > 0 || activeCategory === 'others'
  );

  const selectCategory = (id: ShopCategoryId | null) => {
    setSearchParams(id ? { category: id } : {}, { replace: true });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Wbify Shop',
    description: 'WordPress themes, WordPress plugins, Shopify themes and Shopify apps from Wbify.',
  };

  const tabClass = (isActive: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
      isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-gray-200 hover:border-slate-300'
    }`;

  const renderGrid = (items: Product[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map(product => (
        <ShopProductCard key={product.id} product={product} />
      ))}
    </div>
  );

  const renderEmpty = (message: string) => (
    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
      {message}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO
        title="Shop | WordPress & Shopify Themes and Plugins"
        description="Browse WordPress themes, WordPress plugins, Shopify themes and Shopify apps from Wbify. Request an order and our team will confirm the details."
        canonical="/shop"
        structuredData={structuredData}
      />

      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-4">
              <ShoppingBag size={14} />
              <span>Wbify Shop</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              WordPress & Shopify Themes and Plugins
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Ready-made themes and plugins built by the Wbify team. Pick a product, review the details and send
              an order request. We confirm pricing and payment with you directly.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="rounded-3xl bg-slate-900 text-white px-8 py-6 shadow-xl flex items-center gap-4">
              <Package size={32} className="text-yellow-400" />
              <div>
                <p className="text-sm text-slate-300">Products available</p>
                <p className="text-2xl font-bold">{isLoading ? '…' : products.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10">
          <button onClick={() => selectCategory(null)} className={tabClass(activeCategory === null)}>
            All
          </button>
          {visibleCategories.map(c => (
            <button key={c.id} onClick={() => selectCategory(c.id)} className={tabClass(activeCategory === c.id)}>
              {c.label}
              {!isLoading && (
                <span className="ml-1.5 opacity-60">{productsByCategory.get(c.id)!.length}</span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : activeCategory ? (
          productsByCategory.get(activeCategory)!.length > 0
            ? renderGrid(productsByCategory.get(activeCategory)!)
            : renderEmpty('No products in this category yet. Check back soon or contact us for a custom build.')
        ) : products.length === 0 ? (
          renderEmpty('No products are available yet. Please check back soon or contact us for a custom quote.')
        ) : (
          <div className="space-y-16">
            {visibleCategories
              .filter(c => productsByCategory.get(c.id)!.length > 0)
              .map(c => (
                <section key={c.id}>
                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{c.label}</h2>
                      <p className="text-gray-500 text-sm mt-1">{c.description}</p>
                    </div>
                    <button
                      onClick={() => selectCategory(c.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
                    >
                      View all
                    </button>
                  </div>
                  {renderGrid(productsByCategory.get(c.id)!.slice(0, 6))}
                </section>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
