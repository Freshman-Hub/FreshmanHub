"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/firebase/config/firebaseConfig";

// Hook for real-time document listening
export function useDocument<T = DocumentData>(
  collectionName: string,
  documentId: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Document listener error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, documentId]);

  return { data, loading, error };
}

// Hook for real-time collection listening
export function useCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Collection listener error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Hook for pending user requests (Admin use)
export function usePendingRequests() {
  return useCollection("userRequests", [
    where("status", "==", "pending"),
    orderBy("createdAt", "desc"),
  ]);
}

// Hook for admin logs
export function useAdminLogs(limitCount = 50) {
  return useCollection("adminLogs", [
    orderBy("timestamp", "desc"),
    limit(limitCount),
  ]);
}

// Hook for system logs
export function useSystemLogs(limitCount = 50) {
  return useCollection("systemLogs", [
    orderBy("timestamp", "desc"),
    limit(limitCount),
  ]);
}
