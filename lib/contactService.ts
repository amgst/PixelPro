import {
    collection,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const CONTACT_MESSAGES_COLLECTION = 'contact_messages';

export interface ContactMessageData {
    firstName: string;
    lastName: string;
    email: string;
    service: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt?: any;
}

export const submitContactMessage = async (data: Omit<ContactMessageData, 'status' | 'createdAt'>): Promise<string> => {
    const colRef = collection(db, CONTACT_MESSAGES_COLLECTION);
    const docRef = await addDoc(colRef, {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
    });
    return docRef.id;
};
