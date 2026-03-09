import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export const TESTIMONIALS_COLLECTION = 'testimonials';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    image?: string;
    content: string;
    rating: number;
    order?: number;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
    const testimonialsRef = collection(db, TESTIMONIALS_COLLECTION);
    const testimonialsQuery = query(testimonialsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(testimonialsQuery);

    return snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
    } as Testimonial));
};

export const addTestimonial = async (
    testimonial: Omit<Testimonial, 'id'>
): Promise<Testimonial> => {
    const testimonialsRef = collection(db, TESTIMONIALS_COLLECTION);
    const payload = {
        ...testimonial,
        role: testimonial.role ?? '',
        company: testimonial.company ?? '',
        rating: testimonial.rating ?? 5,
        order: testimonial.order ?? 0
    };
    const docRef = await addDoc(testimonialsRef, payload);

    return {
        id: docRef.id,
        ...payload
    };
};

export const updateTestimonial = async (
    id: string,
    testimonial: Partial<Testimonial>
): Promise<void> => {
    const testimonialRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await updateDoc(testimonialRef, testimonial);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    const testimonialRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await deleteDoc(testimonialRef);
};
