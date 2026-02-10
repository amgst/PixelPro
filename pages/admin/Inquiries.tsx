import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getInquiries, updateInquiryStatus, InquiryData } from '../../lib/inquiryService';
import { Mail, Phone, Calendar, CheckCircle, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const AdminInquiries: React.FC = () => {
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const data = await getInquiries();
            setInquiries(data);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: InquiryData['status']) => {
        try {
            await updateInquiryStatus(id, newStatus);
            // Optimistic update
            setInquiries(inquiries.map(inq => 
                inq.id === id ? { ...inq, status: newStatus } : inq
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore timestamp
        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString() + ' ' + timestamp.toDate().toLocaleTimeString();
        }
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Project Inquiries</h1>
                    <div className="text-sm text-slate-500">
                        Total: {inquiries.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {inquiries.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <p className="text-slate-500">No inquiries found.</p>
                            </div>
                        ) : (
                            inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div 
                                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => inquiry.id && toggleExpand(inquiry.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${inquiry.status === 'new' ? 'bg-blue-500' : inquiry.status === 'contacted' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{inquiry.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1"><Mail size={14} /> {inquiry.email}</span>
                                                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-xs">{inquiry.serviceType}</span>
                                                    <span className="text-xs text-slate-400">{formatDate(inquiry.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status}
                                            </span>
                                            {expandedId === inquiry.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {expandedId === inquiry.id && (
                                        <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Contact Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Mail size={16} /> <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">{inquiry.email}</a>
                                                        </div>
                                                        {inquiry.phone && (
                                                            <div className="flex items-center gap-2 text-slate-600">
                                                                <Phone size={16} /> <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">{inquiry.phone}</a>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Calendar size={16} /> Timeline: {inquiry.timeline}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Project Specifics</h4>
                                                    <div className="space-y-2 text-sm text-slate-600">
                                                        {inquiry.serviceType === 'shopify' && (
                                                            <>
                                                                <p><span className="font-medium">Product Type:</span> {inquiry.shopifyProductType}</p>
                                                                <p><span className="font-medium">Has Products:</span> {inquiry.shopifyHasProducts}</p>
                                                                <p><span className="font-medium">Budget:</span> {inquiry.shopifyBudget}</p>
                                                            </>
                                                        )}
                                                        {inquiry.serviceType === 'web-dev' && (
                                                            <>
                                                                <p><span className="font-medium">Type:</span> {inquiry.webDevType}</p>
                                                                <p><span className="font-medium">Pages:</span> {inquiry.webDevPages}</p>
                                                                {inquiry.webDevFeatures && (
                                                                    <p><span className="font-medium">Features:</span> {inquiry.webDevFeatures.join(', ')}</p>
                                                                )}
                                                            </>
                                                        )}
                                                        {inquiry.serviceType === 'graphics' && (
                                                            <>
                                                                <p><span className="font-medium">Type:</span> {inquiry.graphicsType}</p>
                                                                <p><span className="font-medium">Brand Exists:</span> {inquiry.graphicsBrandExists}</p>
                                                                <p><span className="font-medium">Usage:</span> {inquiry.graphicsUsage}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {inquiry.additionalInfo && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Additional Information</h4>
                                                    <p className="text-slate-600 bg-white p-4 rounded-lg border border-slate-200 text-sm whitespace-pre-wrap">
                                                        {inquiry.additionalInfo}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                                <span className="text-sm font-medium text-slate-700">Update Status:</span>
                                                <button 
                                                    onClick={() => inquiry.id && handleStatusChange(inquiry.id, 'new')}
                                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${inquiry.status === 'new' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-500 hover:text-blue-600'}`}
                                                >
                                                    New
                                                </button>
                                                <button 
                                                    onClick={() => inquiry.id && handleStatusChange(inquiry.id, 'contacted')}
                                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${inquiry.status === 'contacted' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-slate-600 border-slate-300 hover:border-yellow-500 hover:text-yellow-600'}`}
                                                >
                                                    Contacted
                                                </button>
                                                <button 
                                                    onClick={() => inquiry.id && handleStatusChange(inquiry.id, 'closed')}
                                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${inquiry.status === 'closed' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-300 hover:border-green-500 hover:text-green-600'}`}
                                                >
                                                    Closed
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInquiries;
