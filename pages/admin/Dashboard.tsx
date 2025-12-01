import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.ElementType; color: string }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center">
                <TrendingUp size={14} className="mr-1" />
                {change}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value="$12,450"
                    change="+12.5%"
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Active Projects"
                    value="8"
                    change="+2"
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="New Inquiries"
                    value="24"
                    change="+18.2%"
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Avg. Project Value"
                    value="$1,850"
                    change="+4.3%"
                    icon={TrendingUp}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Inquiries</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                        JD
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">John Doe</p>
                                        <p className="text-sm text-gray-500">Shopify Store Setup</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                                    New
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Active Projects</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-gray-100 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-slate-900">E-Commerce Redesign</h4>
                                    <span className="text-xs text-gray-500">Due in 3 days</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
