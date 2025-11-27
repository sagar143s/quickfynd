import React, { useState } from 'react';
import { X, Truck, Undo2 } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Image from 'next/image';
import GoogleIcon from '../assets/google.png';

const SignInModal = ({ open, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      setError('Google sign-in failed');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    setLoading(true);
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">{isRegister ? 'Register' : 'Sign in / Register'}</h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-green-600 text-xs font-medium flex items-center gap-1">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            All data is safeguarded
          </span>
        </div>
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex flex-col items-center text-xs">
            <Truck size={28} className="text-orange-500 mb-1" />
            <span className="font-semibold">Free shipping</span>
            <span className="text-gray-500">Special for you</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <Undo2 size={28} className="text-orange-500 mb-1" />
            <span className="font-semibold">Free returns</span>
            <span className="text-gray-500">Up to 90 days</span>
          </div>
        </div>
        <form className="flex flex-col gap-3 mb-2" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition text-base"
            disabled={loading}
          >
            {isRegister ? 'Register' : 'Continue'}
          </button>
        </form>
        {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}
        <div className="text-center mb-3">
          <button
            className="text-xs text-gray-500 hover:underline"
            onClick={() => setIsRegister(v => !v)}
            type="button"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">Or continue with Google</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="flex justify-center mb-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 px-4 text-base font-medium bg-white hover:bg-gray-50 transition shadow-sm"
            style={{ boxShadow: '0 1px 2px rgba(60,64,67,.08)' }}
            disabled={loading}
          >
            <span className="inline-block w-5 h-5 mr-2">
              <Image src={GoogleIcon} alt="Google" width={20} height={20} style={{objectFit:'contain'}} />
            </span>
            <span className="text-gray-700">Sign up with Google</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          By continuing, you agree to our <a href="/terms" className="underline">Terms of Use</a> and <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
