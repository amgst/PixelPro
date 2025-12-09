import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads an image file to Firebase Storage and returns the download URL
 * @param file - The image file to upload
 * @param folder - The folder path in storage (e.g., 'ready-sites')
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'ready-sites'): Promise<string> => {
    try {
        // Create a unique filename with timestamp
        const timestamp = Date.now();
        // Sanitize filename - remove special characters
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${folder}/${timestamp}_${sanitizedFileName}`;
        
        // Create a reference to the file location
        const storageRef = ref(storage, fileName);
        
        // Upload the file
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        return downloadURL;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        
        // Provide more specific error messages
        if (error.code === 'storage/unauthorized') {
            throw new Error('Permission denied. Please check Firebase Storage rules.');
        } else if (error.code === 'storage/canceled') {
            throw new Error('Upload was canceled.');
        } else if (error.code === 'storage/unknown') {
            throw new Error('Unknown error occurred. This might be a CORS issue. Please configure CORS in Firebase Storage.');
        }
        
        throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
};

