import React, { useState, useEffect } from 'react';
import {
    getServiceCategories,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    ServiceCategory,
    ServiceItem
} from '../../lib/servicesService';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminServices: React.FC = () => {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<ServiceCategory>>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await getServiceCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            alert("Failed to fetch categories.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory.title || !currentCategory.iconName) {
            alert("Title and Icon Name are required.");
            return;
        }

        try {
            if (currentCategory.id) {
                await updateServiceCategory(currentCategory.id, currentCategory);
            } else {
                await addServiceCategory({
                    ...currentCategory,
                    services: currentCategory.services || []
                } as ServiceCategory);
            }
            await fetchCategories();
            setIsEditing(false);
            setCurrentCategory({});
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category.");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteServiceCategory(id);
            await fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category.");
        }
    };

    const handleAddService = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        const newService: ServiceItem = {
            id: Date.now().toString(),
            title: 'New Service',
            description: 'Service Description',
            features: [],
            pricing: { basic: '$0', standard: '$0', premium: '$0' }
        };

        const updatedCategory = {
            ...category,
            services: [...category.services, newService]
        };

        handleUpdateCategory(updatedCategory);
    };

    const handleUpdateCategory = async (updatedCategory: ServiceCategory) => {
        try {
            await updateServiceCategory(updatedCategory.id, updatedCategory);
            setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category.");
        }
    };

    const handleUpdateService = (categoryId: string, serviceId: string, field: keyof ServiceItem, value: any) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        const updatedServices = category.services.map(s =>
            s.id === serviceId ? { ...s, [field]: value } : s
        );

        handleUpdateCategory({ ...category, services: updatedServices });
    };

    const handleDeleteService = (categoryId: string, serviceId: string) => {
        if (!window.confirm("Delete this service?")) return;
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        const updatedServices = category.services.filter(s => s.id !== serviceId);
        handleUpdateCategory({ ...category, services: updatedServices });
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Services</h1>
                    <button
                        onClick={() => { setCurrentCategory({}); setIsEditing(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={20} /> Add Category
                    </button>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="space-y-6">
                        {categories.map(category => (
                            <div key={category.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            {category.title}
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{category.iconName}</span>
                                        </h2>
                                        <p className="text-gray-600">{category.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setCurrentCategory(category); setIsEditing(true); }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                                        >
                                            {expandedCategory === category.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {expandedCategory === category.id && (
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-semibold">Services</h3>
                                            <button
                                                onClick={() => handleAddService(category.id)}
                                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Add Service
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {category.services.map(service => (
                                                <div key={service.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                                        <input
                                                            type="text"
                                                            value={service.title}
                                                            onChange={(e) => handleUpdateService(category.id, service.id, 'title', e.target.value)}
                                                            className="border p-2 rounded"
                                                            placeholder="Service Title"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={service.description}
                                                            onChange={(e) => handleUpdateService(category.id, service.id, 'description', e.target.value)}
                                                            className="border p-2 rounded"
                                                            placeholder="Short Description"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleDeleteService(category.id, service.id)}
                                                            className="text-red-500 text-sm hover:underline"
                                                        >
                                                            Remove Service
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {category.services.length === 0 && <p className="text-gray-400 text-sm italic">No services yet.</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{currentCategory.id ? 'Edit Category' : 'Add Category'}</h2>
                                <button onClick={() => setIsEditing(false)}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSaveCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={currentCategory.title || ''}
                                        onChange={e => setCurrentCategory({ ...currentCategory, title: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={currentCategory.description || ''}
                                        onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Icon Name (Lucide React)</label>
                                    <input
                                        type="text"
                                        value={currentCategory.iconName || ''}
                                        onChange={e => setCurrentCategory({ ...currentCategory, iconName: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        placeholder="e.g. ShoppingBag, Code, Palette"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                    Save Category
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminServices;
