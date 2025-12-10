import { db } from './config';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

export const createSession = async (sessionData) => {
  const docRef = await addDoc(collection(db, 'sessions'), sessionData);
  return docRef.id;
};

export const getAllSessions = async () => {
  const snapshot = await getDocs(collection(db, 'sessions'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const submitAttendance = async (sessionId, userId) => {
  const attendanceRef = doc(db, 'attendance', `${sessionId}_${userId}`);
  await setDoc(attendanceRef, { sessionId, userId, timestamp: new Date() });
};

export const getAttendanceBySession = async (sessionId) => {
  const q = query(collection(db, 'attendance'), where('sessionId', '==', sessionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};
