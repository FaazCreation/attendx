
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Cache service instances to prevent internal SDK assertion errors
let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedFirestore: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

export function initializeFirebase() {
  if (!cachedApp) {
    if (!getApps().length) {
      try {
        cachedApp = initializeApp(firebaseConfig);
      } catch (e) {
        console.warn('Manual initialization fallback triggered.', e);
        cachedApp = initializeApp(firebaseConfig);
      }
    } else {
      cachedApp = getApp();
    }
    
    cachedAuth = getAuth(cachedApp);
    cachedFirestore = getFirestore(cachedApp);
    cachedStorage = getStorage(cachedApp);
  }

  return {
    firebaseApp: cachedApp!,
    auth: cachedAuth!,
    firestore: cachedFirestore!,
    storage: cachedStorage!
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
