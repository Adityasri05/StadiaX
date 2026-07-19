"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStadiaStore } from "@/store/useStadiaStore";

export default function AuthSync() {
  const { setUser, setAuthLoading } = useStadiaStore();

  useEffect(() => {
    // Check if there is a saved demo user session in localStorage
    if (typeof window !== "undefined") {
      const savedDemo = localStorage.getItem("stadiax_demo_user");
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed);
          setAuthLoading(false);
          
          // Still register the state listener to clear the demo session if a real user authenticates
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              localStorage.removeItem("stadiax_demo_user");
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              });
            }
          });
          return () => unsubscribe();
        } catch (e) {
          localStorage.removeItem("stadiax_demo_user");
        }
      }
    }

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
