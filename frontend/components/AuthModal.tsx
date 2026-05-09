import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string, name?: string, mode?: 'login' | 'register') => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [socialToast, setSocialToast] = useState('');
  const [error, setError] = useState('');

  // Escape key to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  const showComingSoon = (label: string) => {
    setSocialToast(`${label} sign-in coming soon!`);
    setTimeout(() => setSocialToast(''), 3000);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await onSignIn(email, password, name || undefined, mode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-6 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border-none">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-apple-blue text-white mb-6 shadow-lg shadow-apple-blue/20">
                 <span className="font-black text-2xl">D</span>
              </div>
              <h3 id="modal-title" className="text-3xl font-black text-slate-900 tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-widest">
                {mode === 'login' ? 'Manage your ads and services' : 'Join the Daberli community'}
              </p>
            </div>

            {socialToast && (
                <div className="mb-4 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm text-center">
                  {socialToast}
                </div>
              )}

              {error && (
                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-apple-blue/5 transition-all text-sm font-bold"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    autoFocus={mode === 'login'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-apple-blue/5 transition-all text-sm font-bold"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-4 mr-4">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => showComingSoon('Password reset')} className="text-[11px] font-black text-apple-blue uppercase tracking-widest hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-apple-blue/5 transition-all text-sm font-bold"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-4 px-4 rounded-2xl shadow-lg shadow-apple-blue/20 text-sm font-black text-white bg-apple-blue hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    {mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'} <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => showComingSoon('Google')} className="flex items-center justify-center w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45z" fill="#fff"/><path d="M20.45 12c0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45 4.6667 0 8.45-3.7833 8.45-8.45z" fill="#4285F4" fillOpacity="1"/><path d="M20.45 12c0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45 4.6667 0 8.45-3.7833 8.45-8.45z" fill="#4285F4" fillOpacity="1"/><path d="M17.5 12.25c.15-.8.25-1.65.25-2.5 0-.25-.05-.45-.05-.7H12v3h3.45c-.3 1.5-1.45 2.7-3.45 3.4v2h2.55c3.2-2.15 4.45-5.3 4.45-8.2z" fill="#fff"/>
                  </svg>
                  Google
                </button>
                 <button type="button" onClick={() => showComingSoon('Facebook')} className="flex items-center justify-center w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="font-bold">f</span>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-6 text-center">
            <p className="text-sm font-bold text-slate-500">
              {mode === 'login'
                  ? <>No account? <button type="button" onClick={() => setMode('register')} className="font-black text-apple-blue hover:underline">Join Now</button></>
                  : <>Member? <button type="button" onClick={() => setMode('login')} className="font-black text-apple-blue hover:underline">Sign In</button></>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;