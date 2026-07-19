"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStadiaStore } from "@/store/useStadiaStore";

/**
 * AuthSync Component
 * Listens to Firebase Authentication state changes on the client side
 * and syncs user credentials and loading flags into the global Zustand store.
 */
export default function AuthSync() {
  const { setUser, setAuthLoading } = useStadiaStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setAuthLoading]);

  return null;
}
