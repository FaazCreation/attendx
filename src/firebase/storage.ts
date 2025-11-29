'use client';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { initializeFirebase } from '.';

const { storage } = initializeFirebase();

/**
 * Uploads an image file to Firebase Storage.
 *
 * @param file The image file to upload.
 * @param path The path in Firebase Storage where the file should be stored (e.g., 'profile-photos').
 * @param onProgress A callback function to track upload progress.
 * @returns A promise that resolves with the download URL of the uploaded file.
 */
export const uploadImage = (
  file: File,
  path: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!storage) {
        reject(new Error("Firebase Storage is not initialized."));
        return;
    }

    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
