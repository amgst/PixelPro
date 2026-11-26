import { auth } from './firebase';
import { optimizeImage } from './storageService';

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50) || 'product';

const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = () => reject(new Error('Could not read the image.'));
        reader.readAsDataURL(blob);
    });

/**
 * Compresses an image and commits it to public/products in the GitHub repo
 * (via /api/upload-product-image). Returns the site path, e.g.
 * "/products/cursor-forge-1764150000000.jpg". The file goes live once the
 * Vercel redeploy triggered by the commit finishes (usually 1–2 minutes).
 */
export const uploadProductImage = async (file: File, nameHint?: string): Promise<string> => {
    if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
    if (file.size > 15 * 1024 * 1024) throw new Error('Image must be smaller than 15MB.');

    const user = auth.currentUser;
    if (!user) throw new Error('You need to be signed in to upload images.');

    const compressed = await optimizeImage(file, 1400, 0.82);
    const filename = `${slugify(nameHint || file.name)}-${Date.now()}.jpg`;
    const content = await blobToBase64(compressed);
    const idToken = await user.getIdToken();

    const res = await fetch('/api/upload-product-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ filename, content }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || typeof data.path !== 'string') {
        throw new Error(data.message || `Upload failed (${res.status}).`);
    }
    return data.path;
};
