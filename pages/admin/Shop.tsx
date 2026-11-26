import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Product, SHOP_CATEGORIES, getShopCategoryId, getShopCategory, normalizeProductUrl } from '../../data/productsData';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../lib/productsService';
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from '../../lib/productImage';
import { uploadProductImage } from '../../lib/productImageUpload';
import { Plus, Trash2, Edit2, Save, X, Upload, Loader2, ExternalLink } from 'lucide-react';

const AdminShop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isUploading, setIsUploading] = useState(false);
  // Local preview of a just-uploaded image: the committed file is only served
  // after the Vercel redeploy finishes.
  const [localPreview, setLocalPreview] = useState<{ path: string; url: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearLocalPreview = () => {
    setLocalPreview(prev => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploading(true);
    try {
      const path = await uploadProductImage(file, currentProduct.name || file.name);
      clearLocalPreview();
      setLocalPreview({ path, url: URL.createObjectURL(file) });
      setCurrentProduct(prev => ({ ...prev, image: path }));
    } catch (err: any) {
      console.error('Error uploading product image', err);
      alert(err?.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Error fetching products', e);
      alert('Failed to fetch products. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (e) {
      console.error('Error deleting product', e);
      alert('Failed to delete product.');
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    clearLocalPreview();
    setFormError(null);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      name: '',
      category: SHOP_CATEGORIES[0].id,
      image: '',
      price: 0,
      shortDescription: '',
      description: '',
      productUrl: '',
      status: 'active',
    });
    clearLocalPreview();
    setFormError(null);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.description || !currentProduct.category) return;
    if (isUploading) return;

    const productUrl = normalizeProductUrl(currentProduct.productUrl);
    if (currentProduct.productUrl?.trim() && !productUrl) {
      setFormError('Product link must be a valid http(s) web address.');
      return;
    }
    setFormError(null);

    try {
      const rawPrice =
        typeof currentProduct.price === 'string'
          ? parseFloat(currentProduct.price)
          : currentProduct.price;
      const price = Number.isFinite(rawPrice) ? (rawPrice as number) : 0;

      const data: Omit<Product, 'id'> = {
        name: currentProduct.name,
        category: getShopCategoryId(currentProduct.category),
        image: currentProduct.image || '',
        price,
        shortDescription: currentProduct.shortDescription || '',
        description: currentProduct.description,
        sku: currentProduct.sku || '',
        tags: currentProduct.tags || [],
        productUrl,
        status: currentProduct.status || 'active',
      };

      if (currentProduct.id) {
        await updateProduct(currentProduct.id, data);
      } else {
        await addProduct(data);
      }
      await fetchProducts();
      setIsEditing(false);
      setCurrentProduct({});
    } catch (e) {
      console.error('Error saving product', e);
      alert('Failed to save product.');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop Products</h1>
          <p className="text-gray-500">
            Manage the WordPress & Shopify themes, plugins and other products listed in the public Shop.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {products.find(p => p.id === currentProduct.id) ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={currentProduct.name || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={getShopCategoryId(currentProduct.category)}
                    onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {SHOP_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={Number.isFinite(currentProduct.price) ? currentProduct.price : ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Leave blank for quote only"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={currentProduct.sku || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={currentProduct.status || 'active'}
                    onChange={e =>
                      setCurrentProduct({
                        ...currentProduct,
                        status: e.target.value as Product['status'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="url"
                    value={currentProduct.productUrl || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, productUrl: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://themeforest.net/item/... or https://apps.shopify.com/..."
                  />
                  {normalizeProductUrl(currentProduct.productUrl) && (
                    <a
                      href={normalizeProductUrl(currentProduct.productUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-50 flex items-center"
                      title="Open link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Where customers get the product. When set, the product page shows a "Get it" button to this link
                  instead of the order request form.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={currentProduct.shortDescription || ''}
                  onChange={e =>
                    setCurrentProduct({ ...currentProduct, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Shown on listing cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  required
                  rows={5}
                  value={currentProduct.description || ''}
                  onChange={e =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                {currentProduct.image && (
                  <div className="mb-3">
                    <img
                      src={
                        localPreview?.path === currentProduct.image
                          ? localPreview.url
                          : getProductImageUrl(currentProduct.image)
                      }
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentProduct.image || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Upload an image, or paste a URL"
                    disabled={isUploading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Uploading
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Upload
                      </>
                    )}
                  </button>
                  {currentProduct.image && !isUploading && (
                    <button
                      type="button"
                      onClick={() => setCurrentProduct({ ...currentProduct, image: '' })}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploads are resized to 1400px wide, saved as JPEG in the site's <code>public/products</code> folder
                  on GitHub, and go live after the site redeploys (about 1–2 minutes).
                </p>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
                >
                  <Save size={18} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 flex items-center gap-3">
                  {product.image && (
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                      {product.name}
                      {product.productUrl && (
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                          title={product.productUrl}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.shortDescription || product.description.slice(0, 80)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{getShopCategory(product.category).label}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {product.price ? `$${product.price.toFixed(2)}` : 'Quote'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={5}>
                  No products found. Use “Add Product” to create your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminShop;
