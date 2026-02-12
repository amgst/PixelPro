import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where, doc, setDoc } from 'firebase/firestore';
import { db, messaging } from '../../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { INQUIRIES_COLLECTION } from '../../lib/inquiryService';
import { CONTACT_MESSAGES_COLLECTION } from '../../lib/contactService';

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
            console.log('Notification permission:', Notification.permission);
        }
    }, []);

    // Handle foreground FCM messages
    useEffect(() => {
        if (messaging) {
            onMessage(messaging, (payload) => {
                console.log('FCM Message received in foreground:', payload);
                showNotification(
                    payload.notification?.title || 'New Message',
                    payload.notification?.body || '',
                    payload.data?.url
                );
            });
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            alert('This browser does not support desktop notification');
            return;
        }
        try {
            const p = await Notification.requestPermission();
            setPermission(p);
            console.log('Permission requested:', p);
            if (p === 'granted') {
                new Notification('Notifications Enabled', {
                    body: 'You will now receive alerts for new inquiries.',
                    icon: '/shopify.png'
                });

                // Get FCM Token
                if (messaging) {
                    try {
                        // Request FCM Token
                        // VAPID key is optional if using default config, but recommended
                        // You can get this from Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates
                        const currentToken = await getToken(messaging, {
                            // vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' 
                        });
                        
                        if (currentToken) {
                            console.log('FCM Token:', currentToken);
                            // Save token to Firestore
                            await setDoc(doc(db, 'admin_fcm_tokens', currentToken), {
                                token: currentToken,
                                userAgent: navigator.userAgent,
                                createdAt: new Date(),
                                lastSeen: new Date()
                            });
                            console.log('FCM Token saved to Firestore');
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    } catch (err) {
                        console.error('An error occurred while retrieving FCM token.', err);
                    }
                }
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
        }
    };

    const showNotification = async (title: string, body: string, url?: string) => {
        if (permission === 'granted') {
            try {
                // Try Service Worker first (better for mobile/PWA)
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    if (registration) {
                        registration.showNotification(title, {
                            body,
                            icon: '/shopify.png',
                            data: { url }
                        });
                        return;
                    }
                }

                // Fallback to standard Notification API
                const notification = new Notification(title, {
                    body,
                    icon: '/shopify.png',
                });
                notification.onclick = () => {
                    window.focus();
                    if (url) {
                        window.location.href = url;
                    }
                };
            } catch (e) {
                console.error('Notification creation failed', e);
            }
        }
    };

    // Listen for new Inquiries
    useEffect(() => {
        if (permission !== 'granted') return;

        const now = new Date();
        const q = query(
            collection(db, INQUIRIES_COLLECTION),
            where('createdAt', '>', now)
        );

        console.log('Setting up inquiry listener');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    console.log('New inquiry received:', data);
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

        console.log('Setting up contact listener');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    console.log('New contact message received:', data);
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
        </NotificationContext.Provider>
    );
};
