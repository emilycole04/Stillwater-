import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string | null;
    email: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  const currentUser = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown error',
    operationType,
    path,
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || false,
      isAnonymous: currentUser?.isAnonymous || false,
      providerInfo: currentUser?.providerData || [],
    }
  };
  console.error("Firestore Error:", errorInfo);
  throw new Error(JSON.stringify(errorInfo));
};

export const moodService = {
  async logMood(mood: string, intensity: number, note?: string) {
    if (!auth.currentUser) throw new Error("Unauthorized");
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/mood_logs`;
    try {
      await addDoc(collection(db, path), {
        mood,
        intensity,
        note,
        userId,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async getMoodLogs() {
    if (!auth.currentUser) return [];
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/mood_logs`;
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString()
      }));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  }
};

export const journalService = {
  async saveEntry(mood: string, content: string, prompt: string) {
    if (!auth.currentUser) throw new Error("Unauthorized");
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/journal_entries`;
    try {
      await addDoc(collection(db, path), {
        mood,
        content,
        prompt,
        userId,
        date: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async getEntries() {
    if (!auth.currentUser) return [];
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/journal_entries`;
    try {
      const q = query(collection(db, path), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp)?.toDate().toISOString() || new Date().toISOString()
      }));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  }
};

export const calendarService = {
  async saveEvent(event: any) {
    if (!auth.currentUser) throw new Error("Unauthorized");
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/calendar_events`;
    try {
       const { id, ...data } = event;
       await addDoc(collection(db, path), {
         ...data,
         userId,
         createdAt: serverTimestamp()
       });
    } catch (e) {
      handleFirestoreError(e, 'create', path);
    }
  },

  async getEvents() {
    if (!auth.currentUser) return [];
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/calendar_events`;
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  }
};

export const routineService = {
  async getRoutines() {
    if (!auth.currentUser) return [];
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/routines`;
    try {
      const snapshot = await getDocs(collection(db, path));
      const routines = [];
      for (const d of snapshot.docs) {
        const tasksPath = `${path}/${d.id}/tasks`;
        const tasksSnapshot = await getDocs(collection(db, tasksPath));
        routines.push({
          id: d.id,
          ...d.data(),
          tasks: tasksSnapshot.docs.map(td => ({ id: td.id, ...td.data() }))
        });
      }
      return routines;
    } catch (e) {
      handleFirestoreError(e, 'list', path);
      return [];
    }
  },

  async toggleTask(routineId: string, taskId: string, completed: boolean) {
    if (!auth.currentUser) throw new Error("Unauthorized");
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/routines/${routineId}/tasks/${taskId}`;
    try {
      await updateDoc(doc(db, path), {
        completed,
        lastCompleted: completed ? serverTimestamp() : null
      });
    } catch (e) {
      handleFirestoreError(e, 'update', path);
    }
  }
};
