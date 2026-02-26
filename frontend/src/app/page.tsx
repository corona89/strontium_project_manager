'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [is2faRequired, setIs2faRequired] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.is_2fa_required) {
        setIs2faRequired(true);
        localStorage.setItem('temp_token', res.data.access_token);
      } else {
        localStorage.setItem('token', res.data.access_token);
        router.push('/workspaces');
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Authentication failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const tempToken = localStorage.getItem('temp_token');

    try {
      const res = await api.post(`/auth/2fa/verify?code=${otp}`, {}, {
        headers: { Authorization: `Bearer ${tempToken}` }
      });
      localStorage.setItem('token', res.data.access_token);
      localStorage.removeItem('temp_token');
      router.push('/workspaces');
    } catch (err: any) {
      alert('Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center p-8">
      <div className="p-8 bg-[#18181b] border border-[#27272a] rounded-[3rem] mb-10 shadow-2xl animate-pulse">
        <Sparkles size={60} strokeWidth={1.5} />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Trello Copy</h1>
        <p className="text-zinc-500 text-sm">Secure Agile Neural Cluster v4.2.0</p>
      </div>

      <div className="w-full max-w-[400px] bg-[#18181b] border border-[#27272a] rounded-[2rem] p-10 shadow-2xl">
        {!is2faRequired ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-zinc-500 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-zinc-700 w-[18px]" />
                <input 
                  type="email" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white transition-colors"
                  placeholder="USER@ARCHIVE.CORE"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-zinc-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-zinc-700 w-[18px]" />
                <input 
                  type="password" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white transition-colors"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-white text-black rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin w-5" /> : "INITIALIZE SESSION"}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FAVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black text-zinc-500 uppercase tracking-widest ml-1">Multi-Factor Auth</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-4 text-zinc-700 w-[18px]" />
                <input 
                  type="text" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white tracking-[0.5em] text-center"
                  placeholder="000 000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin w-5" /> : "VERIFY CODE"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
