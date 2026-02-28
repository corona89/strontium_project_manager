'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layout, 
  Plus, 
  Settings, 
  Users, 
  CreditCard, 
  LayoutGrid, 
  Heart,
  Clock,
  Search,
  Bell,
  MoreHorizontal,
  ChevronDown,
  Briefcase,
  Monitor
} from 'lucide-react';
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
    <div className="min-h-screen bg-[#1d2125] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#9fadbc]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1d2125] text-[#b6c2cf] flex flex-col font-sans">
      {/* Global Top Nav (Same as Board) */}
      <header className="h-[48px] border-b border-[#384148] px-4 flex items-center justify-between bg-[#1d2125] z-[100] shrink-0">
          <div className="flex items-center gap-4">
             <div className="hover:bg-[#a6c5e229] p-1.5 rounded transition-colors cursor-pointer">
                <LayoutGrid size={18} className="text-[#9fadbc]" />
             </div>
             <h1 className="text-[18px] font-black tracking-tight text-[#b6c2cf]">STRONTIUM</h1>
             
             <div className="flex items-center gap-1 ml-4 hidden md:flex">
                <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0055cc] hover:bg-[#0747a6] text-white font-bold text-xs transition-colors">
                  Create
                </button>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9fadbc]" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-[#22272b] border border-[#384148] rounded-md h-8 pl-8 pr-4 text-xs focus:bg-[#1d2125] focus:border-[#0055cc] transition-all outline-none w-[200px]"
                />
             </div>
             <div className="flex items-center gap-1">
                <button className="p-2 text-[#9fadbc] hover:bg-[#a6c5e229] rounded-full"><Bell size={18} /></button>
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white ml-2">LA</div>
             </div>
          </div>
       </header>

      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-[1200px] flex gap-10 p-10 pt-14">
          
          {/* Sidebar */}
          <aside className="w-64 hidden lg:flex flex-col space-y-2 sticky top-0 h-fit">
            <button className="flex items-center gap-3 px-3 py-2 bg-[#a6c5e229] text-[#579dff] rounded-lg text-sm font-bold transition-all">
              <Layout size={18} /> Boards
            </button>
            <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#a6c5e229] text-[#b6c2cf] rounded-lg text-sm font-medium transition-all">
              <Monitor size={18} /> Templates
            </button>
            <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#a6c5e229] text-[#b6c2cf] rounded-lg text-sm font-medium transition-all border-b border-[#384148] pb-4 mb-4">
              <LayoutGrid size={18} /> Home
            </button>

            <div className="pt-2 px-3 flex items-center justify-between group">
              <span className="text-[12px] font-bold text-[#9fadbc]">Workspaces</span>
              <button className="p-1 hover:bg-[#a6c5e229] rounded opacity-0 group-hover:opacity-100 transition-all"><Plus size={14} /></button>
            </div>

            {workspaces.map((ws) => (
               <button key={ws.id} className="flex items-center gap-3 px-3 py-2 hover:bg-[#a6c5e229] text-[#b6c2cf] rounded-lg text-sm font-medium transition-all group">
                 <div className="w-6 h-6 rounded bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">{ws.name[0]}</div>
                 <span className="flex-1 text-left truncate">{ws.name}</span>
                 <ChevronDown size={14} className="text-[#9fadbc]" />
               </button>
            ))}

            <div className="pt-10">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                Log Out
              </button>
            </div>
          </aside>

          {/* Main Space */}
          <main className="flex-1">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={24} className="text-[#9fadbc]" />
                <h2 className="text-[16px] font-bold text-[#b6c2cf]">Recently viewed</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                 {/* Fake recent boards just for UI feel */}
                 <div onClick={() => router.push('/board/example')} className="h-24 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-md p-3 relative cursor-pointer hover:opacity-90 transition-all shadow-md group">
                    <span className="font-bold text-white text-[16px]">Strontium Core</span>
                    <Heart size={16} className="absolute bottom-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-all" />
                 </div>
              </div>
            </div>

            <h2 className="text-[16px] font-bold text-[#b6c2cf] uppercase mb-6">YOUR WORKSPACES</h2>

            {workspaces.map((ws) => (
              <div key={ws.id} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-sm font-bold text-white uppercase">{ws.name[0]}</div>
                    <h3 className="text-[16px] font-black text-[#b6c2cf]">{ws.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#a6c5e229] hover:bg-[#a6c5e255] text-[#b6c2cf] rounded text-xs font-bold transition-all"><Layout size={14} /> Boards</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#a6c5e229] text-[#b6c2cf] rounded text-xs font-bold transition-all"><Users size={14} /> Members</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#a6c5e229] text-[#b6c2cf] rounded text-xs font-bold transition-all"><Settings size={14} /> Settings</button>
                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0055cc] hover:bg-[#0747a6] text-white rounded text-xs font-bold transition-all ml-4">Upgrade</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                   {ws.boards && ws.boards.map((board: any) => (
                      <div 
                        key={board.id} 
                        onClick={() => router.push(`/board/${board.id}`)}
                        className="h-24 bg-sky-800 rounded-md p-3 relative cursor-pointer hover:bg-sky-700 transition-all shadow-sm group"
                        style={{ backgroundColor: board.background || '#0747a6' }}
                      >
                         <span className="font-black text-white text-[16px]">{board.title}</span>
                         <Heart size={16} className="absolute bottom-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                   ))}
                   
                   <button className="h-24 bg-[#22272b] hover:bg-[#2c333a] rounded-md flex items-center justify-center text-sm text-[#9fadbc] transition-all border border-transparent hover:border-[#384148]">
                      Create new board
                   </button>
                </div>
              </div>
            ))}
          </main>

        </div>
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
}
