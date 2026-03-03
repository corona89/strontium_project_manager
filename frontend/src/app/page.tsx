'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center font-sans py-20">
      <div className="mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0052cc] rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-[32px] font-black text-white tracking-tighter">STRONTIUM</h1>
      </div>

      <Card className="w-full max-w-[400px] shadow-lg border-[#384148] bg-[#22272b]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-[#b6c2cf]">
            {is2faRequired ? "Verification Required" : "Log in to continue"}
          </CardTitle>
          <CardDescription className="text-center text-[#9fadbc]">
            {is2faRequired ? "Please enter your 2FA code" : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!is2faRequired ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8993a4]" />
                  <Input 
                    type="email" 
                    className="pl-9 bg-[#1d2125] border-[#384148] text-white hover:bg-[#22272b] focus:border-[#4c9aff]"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#8993a4]" />
                  <Input 
                    type="password" 
                    className="pl-9 bg-[#1d2125] border-[#384148] text-white hover:bg-[#22272b] focus:border-[#4c9aff]"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0052cc] hover:bg-[#0065ff] text-white font-bold"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Log in"}
              </Button>
              
              <div className="flex items-center gap-2 py-2">
                <div className="h-px bg-[#384148] flex-1" />
                <span className="text-xs text-[#9fadbc]">OR</span>
                <div className="h-px bg-[#384148] flex-1" />
              </div>
              
              <Button variant="outline" className="w-full border-[#384148] text-[#b6c2cf] bg-[#1d2125] hover:bg-[#22272b] hover:text-white">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Core_Icon.svg" className="mr-2 h-4 w-4" alt="Google" />
                Continue with Google
              </Button>
            </form>
          ) : (
            <form onSubmit={handle2FAVerify} className="space-y-6">
              <div className="space-y-2">
                 <div className="bg-emerald-950/30 text-emerald-400 p-4 rounded-md text-xs flex items-center gap-2 mb-4 border border-emerald-900/50">
                    <CheckCircle2 size={16} /> 2FA secret verified. Please enter code.
                 </div>
                 <Input 
                    type="text" 
                    className="bg-[#1d2125] border-[#384148] text-white focus:border-[#4c9aff] text-center tracking-[0.4em] text-xl font-bold"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0052cc] hover:bg-[#0065ff] text-white font-bold"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Verify and Log in"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-[#384148] pt-6">
           <div className="flex flex-wrap justify-center gap-4 text-xs text-[#9fadbc] font-medium">
              <a href="#" className="hover:underline">Can't log in?</a>
              <span className="text-[#384148]">•</span>
              <a href="#" className="hover:underline">Create an account</a>
           </div>
        </CardFooter>
      </Card>

      <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex gap-6 text-xs text-[#5e6c84] font-medium">
             <a href="#" className="hover:underline">Templates</a>
             <a href="#" className="hover:underline">Pricing</a>
             <a href="#" className="hover:underline">Apps</a>
             <a href="#" className="hover:underline">Jobs</a>
             <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
      </div>
    </div>
  );
}
