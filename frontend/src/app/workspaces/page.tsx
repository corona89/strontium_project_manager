'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Plus, Cpu, ArrowRight, Loader2, LogOut } from 'lucide-react';
import api from '@/lib/api';

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/boards/workspaces');
        setWorkspaces(res.data);
      } catch (err) {
        console.error(err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="animate-spin text-zinc-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#18181b] flex flex-col p-6 space-y-8">
         <div className="flex items-center gap-3 px-2">
            <div className="p-1.5 bg-white rounded-lg"><Cpu size={16} className="text-black" /></div>
            <span className="font-black text-sm uppercase tracking-tighter">Archive Core</span>
         </div>
         
         <nav className="flex-1 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#18181b] rounded-xl text-sm font-bold">
               <LayoutGrid size={18} /> Workspaces
            </button>
         </nav>

         <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-red-500 text-xs font-black uppercase hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={14} /> Terminate Session
         </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
           <h2 className="text-3xl font-black tracking-tighter uppercase">Your Workspaces</h2>
           <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-zinc-200">
              <Plus size={18} /> New Workspace
           </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {workspaces.map((ws) => (
             <div key={ws.id} className="bg-[#18181b] border border-[#27272a] rounded-[2rem] p-8 hover:border-zinc-500 transition-all group">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-[#27272a]">
                      <Cpu size={24} className="text-zinc-600" />
                   </div>
                   <ArrowRight size={20} className="text-zinc-800 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2">{ws.name}</h3>
                <p className="text-zinc-500 text-sm mb-8 line-clamp-2">{ws.description || 'Secure collaboration node initialized.'}</p>
                <div className="flex gap-2">
                    <button className="flex-1 bg-zinc-900 border border-[#27272a] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                       Enter Workspace
                    </button>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
