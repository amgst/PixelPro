import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from './firebase';
import { INQUIRIES_COLLECTION } from './inquiryService';
import { CONTACT_MESSAGES_COLLECTION } from './contactService';
import { Bell } from 'lucide-react';

export const NotificationContext = React.createContext<{
    permission: NotificationPermission;
    requestPermission: () => Promise<void>;
}>({
    permission: 'default',
    requestPermission: async () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }
        const p = await Notification.requestPermission();
        setPermission(p);
    };

    const showNotification = (title: string, body: string, url?: string) => {
        if (permission === 'granted') {
            const notification = new Notification(title, {
                body,
                icon: '/shopify.png', // Using existing icon
            });
            notification.onclick = () => {
                window.focus();
                if (url) {
                    window.location.href = url;
                }
            };
        }
    };

    // Listen for new Inquiries
    useEffect(() => {
        if (permission !== 'granted') return;

        // We only want to listen for *new* additions, not initial load
        // A simple way is to listen for changes after the component mounts
        // However, onSnapshot sends initial state. We need to filter that.
        // Or we can query by 'createdAt' > now.
        
        const now = new Date();
        const q = query(
            collection(db, INQUIRIES_COLLECTION),
            where('createdAt', '>', now)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    showNotification(
                        'New Project Inquiry!',
                        `From: ${data.name} (${data.serviceType})`,
                        '/admin/inquiries'
                    );
                }
            });
        });

        return () => unsubscribe();
    }, [permission]);

    // Listen for new Contact Messages
    useEffect(() => {
        if (permission !== 'granted') return;

        const now = new Date();
        const q = query(
            collection(db, CONTACT_MESSAGES_COLLECTION),
            where('createdAt', '>', now)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    showNotification(
                        'New Contact Message!',
                        `From: ${data.firstName} ${data.lastName}`,
                        '/admin/dashboard'
                    );
                }
            });
        });

        return () => unsubscribe();
    }, [permission]);

    return (
        <NotificationContext.Provider value={{ permission, requestPermission }}>
            {children}
            {permission === 'default' && (
                <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-blue-100 z-50 animate-bounce-in max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Enable Notifications?</h4>
                            <p className="text-sm text-slate-600 mb-3">Get instant alerts when you receive new inquiries or messages.</p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={requestPermission}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                >
                                    Enable
                                </button>
                                <button 
                                    onClick={() => setPermission('denied')}
                                    className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
