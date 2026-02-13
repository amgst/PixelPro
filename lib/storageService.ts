import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage with progress tracking.
 * @param file The file to upload
 * @param path The path in storage
 * @param onProgress Callback function for progress updates (0-100)
 * @returns Promise with the download URL
 */
export const uploadFileWithProgress = (
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) {
                    onProgress(Math.round(progress));
                }
            }, 
            (error) => {
                console.error("Error uploading file:", error);
                reject(error);
            }, 
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

/**
 * Generates a unique filename for storage to avoid collisions.
 */
export const generateUniqueFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    return `${timestamp}-${cleanName}`;
};
