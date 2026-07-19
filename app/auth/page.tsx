"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStadiaStore } from "@/store/useStadiaStore";
import ParticleBg from "@/components/particle-bg";
import { Mail, Lock, User, ArrowLeft, Cpu, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

/** Type guard for Firebase Auth error objects */
function isFirebaseError(e: unknown): e is { code: string; message: string } {
  return typeof e === "object" && e !== null && "code" in e;
}

function AuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { user, setUser } = useStadiaStore();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isSignIn) {
      if (!name.trim()) {
        toast.error("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);
    const authToast = toast.loading(isSignIn ? "Authenticating Operator..." : "Registering Operator...");

    try {
      if (isSignIn) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || email.split("@")[0],
          photoURL: firebaseUser.photoURL,
        });
        toast.success(`Welcome back, ${firebaseUser.displayName || email.split("@")[0]}!`, { id: authToast });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        await updateProfile(firebaseUser, { displayName: name });
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          photoURL: null,
        });
        toast.success(`Operator registration complete. Welcome, ${name}!`, { id: authToast });
      }
      router.push(redirect);
    } catch (error: unknown) {
      console.error("Auth error:", error);
      let errorMsg = "Authentication failed. Please verify credentials.";
      if (isFirebaseError(error)) {
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
          errorMsg = "Invalid email or password configuration.";
        } else if (error.code === "auth/email-already-in-use") {
          errorMsg = "This email is already registered.";
        } else if (error.code === "auth/weak-password") {
          errorMsg = "Password strength is too low.";
        }
      }
      toast.error(errorMsg, { id: authToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const authToast = toast.loading("Connecting with Google OAuth...");
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      toast.success(`Authenticated via Google: ${firebaseUser.displayName}`, { id: authToast });
      router.push(redirect);
    } catch (error: unknown) {
      console.error("Google Auth error:", error);
      toast.error("Google OAuth handshake failed.", { id: authToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] transition-all mb-6 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        RETURN TO PORTAL
      </Link>

      {/* Main Glassmorphic Auth Card */}
      <div className="p-8 rounded-2xl bg-glass-card border border-[rgba(0,229,255,0.15)] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Subtle top neon gradient border */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#00D084]" />

        {/* Brand / Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)] mb-4">
            <Cpu className="w-6 h-6 text-[#07111F]" />
          </div>
          <h2 className="font-heading font-bold text-2xl tracking-wider text-white">
            STADIA<span className="text-[#00E5FF]">X</span> AI OS
          </h2>
          <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest mt-1">
            Stadium Operations Gateway
          </p>
        </div>

        {/* Sign In / Sign Up Selector Tab */}
        <div className="flex bg-[#0A1626] p-1 rounded-lg border border-white/5 mb-8 relative">
          <button
            type="button"
            onClick={() => {
              setIsSignIn(true);
              // Clear fields on toggle
              setPassword("");
              setConfirmPassword("");
            }}
            className={`flex-1 py-2 text-xs font-mono font-semibold tracking-wider rounded-md relative z-10 transition-colors duration-300 ${
              isSignIn ? "text-[#07111F]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignIn(false);
              // Clear fields on toggle
              setPassword("");
              setConfirmPassword("");
            }}
            className={`flex-1 py-2 text-xs font-mono font-semibold tracking-wider rounded-md relative z-10 transition-colors duration-300 ${
              !isSignIn ? "text-[#07111F]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            SIGN UP
          </button>

          {/* Sliding highlight indicator */}
          <motion.div
            layoutId="activeTabGlow"
            className="absolute top-1 bottom-1 left-1 rounded-md bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]"
            style={{
              width: "calc(50% - 4px)",
            }}
            animate={{
              x: isSignIn ? 0 : "100%",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        </div>

        {/* Auth form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <label className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Operator Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 bg-[#0A1626] border border-white/5 focus:border-[#00E5FF] focus:shadow-[0_0_10px_rgba(0,229,255,0.15)] text-sm rounded-lg pl-10 pr-4 text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-none transition-all font-sans"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <label className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="operator@stadiax.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-[#0A1626] border border-white/5 focus:border-[#00E5FF] focus:shadow-[0_0_10px_rgba(0,229,255,0.15)] text-sm rounded-lg pl-10 pr-4 text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={isSignIn ? "••••••••" : "Min. 6 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 bg-[#0A1626] border border-white/5 focus:border-[#00E5FF] focus:shadow-[0_0_10px_rgba(0,229,255,0.15)] text-sm rounded-lg pl-10 pr-10 text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-none transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <label className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 bg-[#0A1626] border border-white/5 focus:border-[#00E5FF] focus:shadow-[0_0_10px_rgba(0,229,255,0.15)] text-sm rounded-lg pl-10 pr-10 text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-none transition-all font-sans"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-[#07111F] font-heading font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(0,229,255,0.25)] hover:shadow-[0_4px_30px_rgba(0,229,255,0.45)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                INITIALIZING...
              </>
            ) : isSignIn ? (
              "ACCESS COCKPIT"
            ) : (
              "REGISTER OPERATOR"
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-[#94A3B8]">OR</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-11 rounded-lg bg-[#101C2D] border border-white/5 hover:border-[#00E5FF]/40 text-[#F8FAFC] font-semibold text-sm tracking-wide hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#00E5FF]" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </button>
      </div>

      {/* OS Telemetry Tag */}
      <div className="mt-4 text-center">
        <span className="text-[9px] font-mono text-[#94A3B8] tracking-widest uppercase">
          SECURE QUANTUM ENCRYPTION • CONFORMS TO FIFA V3.8 PROTOCOL
        </span>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="relative min-h-screen bg-[#07111F] text-[#F8FAFC] overflow-hidden flex items-center justify-center">
      {/* Background Particle Render */}
      <ParticleBg />

      {/* Decorative Grid Overlays */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/30 via-transparent to-[#07111F] pointer-events-none z-0" />

      {/* Wrap searchParams query in Suspense block */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 relative z-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#00E5FF]" />
            <span className="text-xs font-mono text-[#94A3B8] tracking-widest animate-pulse">
              LOADING OPERATOR SYSTEM...
            </span>
          </div>
        }
      >
        <AuthFormContent />
      </Suspense>
    </div>
  );
}
