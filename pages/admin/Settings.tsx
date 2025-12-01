import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminSettings: React.FC = () => {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-gray-500">Manage your account and website settings.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-slate-900">General Settings</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
                        <input
                            type="text"
                            defaultValue="wbify"
                            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">Contact support to change this.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                        <input
                            type="email"
                            defaultValue="admin@wbify.com"
                            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            readOnly
                        />
                    </div>

                    <div className="pt-4">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
