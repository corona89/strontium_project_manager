'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutGrid, 
  Plus, 
  Settings, 
  Users, 
  Layout, 
  Heart,
  Clock,
  MoreHorizontal,
  ChevronDown,
  Monitor,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
      <div className="animate-spin h-8 w-8 border-4 border-[#b6c2cf] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1d2125] text-[#b6c2cf] flex flex-col font-sans">
      {/* Global Top Nav */}
      <header className="h-[48px] border-b border-[#384148] px-4 flex items-center justify-between bg-[#1d2125] z-[100] shrink-0">
          <div className="flex items-center gap-4">
             <div className="hover:bg-[#a6c5e229] p-1.5 rounded transition-colors cursor-pointer">
                <LayoutGrid size={18} className="text-[#9fadbc]" />
             </div>
             <h1 className="text-[18px] font-black tracking-tight text-[#b6c2cf]">STRONTIUM</h1>
             
             <div className="flex items-center gap-1 ml-4 hidden md:flex">
                <Button className="bg-[#0055cc] hover:bg-[#0747a6]">
                  <Plus size={14} className="mr-1 h-3 w-3" /> Create
                </Button>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9fadbc]" />
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-[#22272b] border-[#384148] w-[200px] h-8 pl-8 text-sm"
                />
             </div>
             <div className="flex items-center gap-1">
                <Button variant="ghost" className="p-2 text-[#9fadbc] hover:bg-[#a6c5e229]">
                  <Bell size={18} />
                </Button>
                <Avatar className="h-8 w-8 bg-indigo-600">
                  <AvatarFallback className="font-bold text-sm bg-indigo-600">LA</AvatarFallback>
                </Avatar>
             </div>
          </div>
       </header>

      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-[1200px] flex gap-10 p-10 pt-14">
          
          {/* Sidebar */}
          <aside className="w-64 hidden lg:flex flex-col space-y-2 sticky top-0 h-fit">
            <Button variant="outline" className="bg-[#a6c5e229] text-[#579dff] font-bold border-[#a6c5e229]">
              <Layout size={18} className="mr-2 h-4 w-4" /> Boards
            </Button>
            <Button variant="ghost" className="justify-start text-[#b6c2cf] font-medium">
              <Monitor size={18} className="mr-2 h-4 w-4" /> Templates
            </Button>
            <Button variant="ghost" className="justify-start text-[#b6c2cf] font-medium border-b border-[#384148] pb-4">
              <LayoutGrid size={18} className="mr-2 h-4 w-4" /> Home
            </Button>

            <div className="pt-2 px-3 flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#9fadbc]">Workspaces</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-[#a6c5e229]">
                <Plus size={14} />
              </Button>
            </div>

            {workspaces.map((ws) => (
               <Button key={ws.id} variant="ghost" className="justify-start text-[#b6c2cf] font-medium">
                 <Avatar className="h-6 w-6 bg-emerald-700 mr-2">
                   <AvatarFallback className="text-[10px] font-bold bg-emerald-700 uppercase">{ws.name[0]}</AvatarFallback>
                 </Avatar>
                 <span className="flex-1 text-left truncate">{ws.name}</span>
                 <ChevronDown size={14} className="text-[#9fadbc] ml-2 h-4 w-4" />
               </Button>
            ))}

            <div className="pt-10">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-rose-500 hover:bg-rose-500/10 font-bold"
              >
                <span className="mr-2 h-4 w-4">Log Out</span>
              </Button>
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
                 <Card 
                   onClick={() => router.push('/board/example')} 
                   className="h-24 bg-gradient-to-br from-indigo-700 to-indigo-900 cursor-pointer hover:opacity-90 transition-all shadow-md border-none"
                 >
                    <CardContent className="p-3 flex flex-col justify-between h-full">
                      <span className="font-bold text-white text-[16px]">Strontium Core</span>
                      <Heart size={16} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                    </CardContent>
                 </Card>
              </div>
            </div>

            <h2 className="text-[16px] font-bold text-[#b6c2cf] uppercase mb-6">YOUR WORKSPACES</h2>

            {workspaces.map((ws) => (
              <div key={ws.id} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-emerald-800">
                      <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-emerald-600 to-emerald-800 uppercase">{ws.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-[16px] font-black text-[#b6c2cf]">{ws.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="bg-[#a6c5e229] text-[#b6c2cf]">
                      <Layout size={14} className="mr-1 h-3 w-3" /> Boards
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#b6c2cf]">
                      <Users size={14} className="mr-1 h-3 w-3" /> Members
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#b6c2cf]">
                      <Settings size={14} className="mr-1 h-3 w-3" /> Settings
                    </Button>
                    <Button size="sm" className="bg-[#0055cc] hover:bg-[#0747a6]">Upgrade</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                   {ws.boards && ws.boards.map((board: any) => (
                      <Card 
                        key={board.id} 
                        onClick={() => router.push(`/board/${board.id}`)}
                        className="h-24 rounded-md relative cursor-pointer hover:bg-sky-700 transition-all shadow-sm border-none"
                        style={{ backgroundColor: board.background || '#0747a6' }}
                      >
                         <CardContent className="p-3 flex flex-col justify-between h-full">
                            <span className="font-black text-white text-[16px]">{board.title}</span>
                            <Heart size={16} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                         </CardContent>
                      </Card>
                   ))}
                   
                   <Button variant="outline" className="h-24 rounded-md border-[#384148] hover:bg-[#2c333a] border-dashed">
                      Create new board
                   </Button>
                </div>
              </div>
            ))}
          </main>

        </div>
      </div>
    </div>
  );
}
