import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminPortfolio: React.FC = () => {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Portfolio</h1>
                <p className="text-gray-500">Manage your portfolio items here.</p>
            </div>

            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    This feature is currently under development. You will be able to add, edit, and remove portfolio items from this page soon.
                </p>
            </div>
        </AdminLayout>
    );
};

export default AdminPortfolio;
