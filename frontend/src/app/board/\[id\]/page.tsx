'use client';

import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User as UserIcon, 
  MessageSquare, 
  Paperclip,
  Maximize2
} from 'lucide-react';

export default function BoardPage({ params }: { params: { id: string } }) {
  const boardId = params.id;
  const [board, setBoard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/boards/detail/${boardId}`);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoard();

    // WebSocket Connection
    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/${boardId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WS Update:', data);
      // Trigger re-fetch or state update
      fetchBoard();
    };

    return () => ws.close();
  }, [boardId]);

  if (isLoading || !board) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="animate-spin text-zinc-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
       {/* Board Header */}
       <header className="h-[80px] border-b border-[#18181b] px-8 flex items-center justify-between sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-6">
             <h2 className="text-xl font-black uppercase tracking-tight">{board.title}</h2>
             <div className="h-4 w-px bg-zinc-800" />
             <nav className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-[#18181b] text-xs font-bold border border-[#27272a]">Public Access</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500">History</button>
             </nav>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
             </div>
             <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black shadow-lg">SHARE</button>
          </div>
       </header>

       {/* Kanban Canvas */}
       <main className="flex-1 overflow-x-auto p-10 flex gap-8 items-start scrollbar-hide">
          {board.lists.map((list: any) => (
            <div key={list.id} className="w-[320px] shrink-0 flex flex-col max-h-full">
               <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">{list.title}</h3>
                  <button className="text-zinc-700 hover:text-white"><MoreHorizontal size={18} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {list.cards.map((card: any) => (
                    <div key={card.id} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 group hover:border-zinc-500 cursor-pointer shadow-xl transition-all active:scale-[0.98]">
                       {card.priority === 'high' && <div className="w-8 h-1 bg-rose-500 rounded-full mb-3" />}
                       <h4 className="text-sm font-bold mb-3 leading-snug">{card.title}</h4>
                       
                       <div className="flex items-center gap-4 text-zinc-600">
                          {card.due_date && <div className="flex items-center gap-1.5 text-[10px] font-bold"><Calendar size={12} /> {new Date(card.due_date).toLocaleDateString()}</div>}
                          <div className="flex-1" />
                          <div className="flex items-center gap-2">
                             <MessageSquare size={12} />
                             <Paperclip size={12} />
                          </div>
                       </div>
                    </div>
                  ))}

                  <button className="w-full py-4 border border-dashed border-zinc-800 rounded-2xl text-[10px] font-black text-zinc-700 hover:text-white hover:border-zinc-500 transition-all flex items-center justify-center gap-2">
                     <Plus size={14} /> ADD COMPONENT
                  </button>
               </div>
            </div>
          ))}

          {/* New List Trigger */}
          <button className="w-[320px] shrink-0 h-16 bg-[#18181b]/50 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-zinc-700 hover:text-white transition-all">
             <Plus size={18} /> INITIALIZE NEW CATEGORY
          </button>
       </main>

       <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
       `}</style>
    </div>
  );
}
