'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Sparkles, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f9fafc] text-[#172b4d] flex flex-col items-center font-sans">
      <div className="mt-20 mb-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#0052cc] rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <h1 className="text-[32px] font-black text-[#172b4d] tracking-tighter">STRONTIUM</h1>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-md p-10 pt-8 shadow-[0_8px_16px_-4px_rgba(9,30,66,0.25),0_0_0_1px_rgba(9,30,66,0.08)]">
        <h2 className="text-center font-bold text-[#5e6c84] text-[16px] mb-8 leading-6">
          {is2faRequired ? "Verification Required" : "Log in to continue"}
        </h2>

        {!is2faRequired ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <input 
                type="email" 
                className="w-full bg-[#fafbfc] border-2 border-[#dfe1e6] hover:bg-[#ebecf0] focus:bg-white focus:border-[#4c9aff] rounded-[3px] h-11 px-3 text-sm outline-none transition-all placeholder:text-[#8993a4]"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <input 
                type="password" 
                className="w-full bg-[#fafbfc] border-2 border-[#dfe1e6] hover:bg-[#ebecf0] focus:bg-white focus:border-[#4c9aff] rounded-[3px] h-11 px-3 text-sm outline-none transition-all placeholder:text-[#8993a4]"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10 bg-[#0052cc] hover:bg-[#0065ff] text-white rounded-[3px] font-bold text-sm flex items-center justify-center gap-3 transition-colors active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin w-5" /> : "Log in"}
            </button>
            <div className="text-center pt-2">
                <span className="text-[14px] text-[#5e6c84]">OR</span>
            </div>
            <button className="w-full h-10 bg-white border border-[#dfe1e6] hover:bg-[#ebecf0] rounded-[3px] text-sm font-bold text-[#172b4d] flex items-center justify-center gap-3 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Core_Icon.svg" className="w-4 h-4" />
                Continue with Google
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FAVerify} className="space-y-6">
            <div className="space-y-2">
               <div className="bg-emerald-50 text-emerald-700 p-4 rounded-md text-xs flex items-center gap-2 mb-4">
                  <CheckCircle2 size={16} /> 2FA secret verified. Please enter code.
               </div>
               <input 
                  type="text" 
                  className="w-full bg-[#fafbfc] border-2 border-[#dfe1e6] focus:border-[#4c9aff] rounded-[3px] h-12 px-3 text-center text-xl font-bold tracking-[0.4em] outline-none transition-all"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10 bg-[#0052cc] hover:bg-[#0065ff] text-white rounded-[3px] font-bold text-sm flex items-center justify-center gap-3 transition-colors active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin w-5" /> : "Verify and Log in"}
            </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-[#dfe1e6] flex flex-wrap justify-center gap-4 text-[12px] text-[#5e6c84]">
           <a href="#" className="hover:underline">Can't log in?</a>
           <span className="text-[#dfe1e6]">•</span>
           <a href="#" className="hover:underline">Create an account</a>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-8">
          <div className="flex gap-6 text-[12px] text-[#5e6c84] font-medium">
             <a href="#" className="hover:underline">Templates</a>
             <a href="#" className="hover:underline">Pricing</a>
             <a href="#" className="hover:underline">Apps</a>
             <a href="#" className="hover:underline">Jobs</a>
             <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
          <p className="text-[12px] text-[#5e6c84] flex items-center gap-1.5 opacity-60">
             <Layout size={12} /> Powered by Strontium Neural Systems
          </p>
      </div>
    </div>
  );
}

function Layout(props: any) {
    return (
      <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    );
}
