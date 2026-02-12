import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PortfolioItem, getPortfolios, addPortfolio, updatePortfolio, deletePortfolio } from '../../lib/portfolioService';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const AdminPortfolio: React.FC = () => {
    const [items, setItems] = React.useState<PortfolioItem[]>([]);
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState<Partial<PortfolioItem>>({});
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const fetchedItems = await getPortfolios();
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching portfolios:", error);
            alert("Failed to fetch portfolios.");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deletePortfolio(id);
                await fetchItems();
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item.");
            }
        }
    };

    const handleEdit = (item: PortfolioItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentItem({
            title: '',
            category: 'Graphic Design & Print',
            imageUrl: '',
            description: '',
            link: ''
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem.title || !currentItem.imageUrl) return;

        try {
            if (currentItem.id) {
                await updatePortfolio(currentItem.id, currentItem);
            } else {
                await addPortfolio(currentItem as PortfolioItem);
            }
            await fetchItems();
            setIsEditing(false);
            setCurrentItem({});
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item.");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Portfolio</h1>
                    <p className="text-gray-500">Add or edit portfolio items.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                {currentItem.id ? 'Edit Item' : 'Add New Item'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-slate-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={currentItem.title || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    required
                                    value={currentItem.imageUrl || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={currentItem.category || 'Shopify'}
                                    onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Shopify">Shopify</option>
                                    <option value="React">React</option>
                                    <option value="WordPress">WordPress</option>
                                    <option value="Graphic Design & Print">Graphic Design & Print</option>
                                    <option value="Video & Animation">Video & Animation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={currentItem.description || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                    type="url"
                                    value={currentItem.link || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, link: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Image</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No items found. Click "Add New Item" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminPortfolio;
