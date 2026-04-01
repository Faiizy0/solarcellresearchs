import { useState, useEffect } from 'react';
import { Simulation, defaultSimulation } from './types';
import { db } from './firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: false,
      isAnonymous: true,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useSimulations() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = `public_simulations`;
    const q = query(collection(db, path), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sims: Simulation[] = [];
      snapshot.forEach((docSnap) => {
        sims.push(docSnap.data() as Simulation);
      });
      
      setSimulations(sims);
      
      if (sims.length > 0) {
        setActiveId(prev => sims.some(s => s.id === prev) ? prev : sims[0].id);
      } else {
        // Create a default simulation if none exist
        const newSim = defaultSimulation();
        setDoc(doc(db, path, newSim.id), newSim).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeSimulation = simulations.find(s => s.id === activeId) || simulations[0];

  const updateSimulation = async (id: string, updates: Partial<Simulation>) => {
    const simToUpdate = simulations.find(s => s.id === id);
    if (!simToUpdate) return;

    const updatedSim = { ...simToUpdate, ...updates, updatedAt: Date.now() };
    // Optimistic update
    setSimulations(sims => sims.map(s => s.id === id ? updatedSim : s));
    
    const path = `public_simulations/${id}`;
    try {
      await setDoc(doc(db, `public_simulations`, id), updatedSim);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addSimulation = async () => {
    const newSim = defaultSimulation();
    
    // Optimistic update
    setSimulations(sims => [newSim, ...sims]);
    setActiveId(newSim.id);

    const path = `public_simulations/${newSim.id}`;
    try {
      await setDoc(doc(db, `public_simulations`, newSim.id), newSim);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteSimulation = async (id: string) => {
    // Optimistic update
    setSimulations(sims => {
      const filtered = sims.filter(s => s.id !== id);
      if (filtered.length > 0 && activeId === id) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });

    const path = `public_simulations/${id}`;
    try {
      await deleteDoc(doc(db, `public_simulations`, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return {
    simulations,
    activeSimulation,
    activeId,
    setActiveId,
    updateSimulation,
    addSimulation,
    deleteSimulation,
    loading
  };
}
