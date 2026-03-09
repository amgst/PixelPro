import { generateUniqueFileName, uploadFileWithProgress } from './storageService';

/**
 * Uploads an image file to Firebase Storage.
 * @param file - The image file to upload
 * @param folder - The folder path inside the bucket
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'products'): Promise<string> => {
    try {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Image size must be less than 10MB.');
        }

        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file.');
        }

        const filename = `${folder}/${generateUniqueFileName(file.name)}`;
        return await uploadFileWithProgress(file, filename);
    } catch (error: any) {
        console.error('Error uploading image to Firebase Storage:', error);

        if (error?.message?.includes('size') || error?.message?.includes('image file')) {
            throw error;
        }

        throw new Error(`Failed to upload image: ${error?.message || 'Unknown error'}`);
    }
};
