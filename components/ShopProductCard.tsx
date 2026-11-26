import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Tag } from 'lucide-react';
import { Product, getShopCategory } from '../data/productsData';
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from '../lib/productImage';

const ShopProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const category = getShopCategory(product.category);

  return (
    <Link
      to={`/shop/${product.id}`}
      className="group border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all flex flex-col"
    >
      <div className="aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
            }}
          />
        ) : (
          <Package size={40} className="text-slate-300" />
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
            <Tag size={12} className="mr-1" />
            {category.label}
          </span>
          {product.price ? (
            <span className="text-sm font-bold text-slate-900">${product.price.toFixed(2)}</span>
          ) : (
            <span className="text-xs font-semibold text-slate-500">Price on request</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600">{product.name}</h3>
        <p className="text-sm text-gray-500 flex-1 line-clamp-3">
          {product.shortDescription || product.description}
        </p>
        <div className="mt-6 flex items-center justify-between text-sm font-medium text-blue-600">
          <span>View details</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default ShopProductCard;
