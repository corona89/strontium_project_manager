'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Paperclip,
  Search,
  ChevronLeft,
  Layout,
  Settings,
  Bell,
  CheckCircle2,
  Clock,
  LayoutGrid
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';

function SortableCard({ card }: { card: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { card, type: 'Card' } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-rose-500';
      case 'med': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`bg-[#22272b] border border-[#384148] hover:border-[#454f59] rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing group transition-all duration-200 ${isDragging ? 'shadow-2xl' : ''}`}
    >
      <div className="flex flex-wrap gap-1 mb-2">
        <div className={`h-2 w-10 rounded-full ${getPriorityColor(card.priority)}`} />
      </div>
      
      <h4 className="text-[14px] text-[#b6c2cf] font-medium leading-[20px] mb-3">{card.title}</h4>
      
      <div className="flex items-center gap-3 text-[#9fadbc]">
        {card.due_date && (
          <div className="flex items-center gap-1 text-[11px] bg-[#1d2125] px-1.5 py-0.5 rounded border border-[#384148]">
            <Clock size={12} />
            <span>{new Date(card.due_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2 opacity-60">
          <MessageSquare size={13} />
          <Paperclip size={13} />
          <Avatar className="h-5 w-5 bg-indigo-500">
            <AvatarFallback className="text-[10px] font-bold bg-indigo-500 uppercase leading-none">LA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

function DroppableList({ list, cards, onAddCard }: { list: any; cards: any[]; onAddCard: (id: string) => void }) {
  const {
    setNodeRef,
    isDragging,
  } = useSortable({ id: list.id, data: { list, type: 'List' } });

  return (
    <div 
      ref={setNodeRef}
      className={`w-[272px] shrink-0 flex flex-col bg-[#101204] rounded-xl max-h-full pb-2 shadow-sm ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between p-3 pl-4">
        <h3 className="text-[14px] font-bold text-[#b6c2cf]">{list.title}</h3>
        <Button variant="ghost" className="text-[#9fadbc] hover:bg-[#a6c5e229] h-8 w-8 p-0">
          <MoreHorizontal size={16} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-2 py-1 custom-scrollbar min-h-[10px]">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="px-2 mt-2">
        <Button 
          onClick={() => onAddCard(list.id)}
          variant="ghost"
          className="w-full h-8 flex items-center gap-2 px-3 hover:bg-[#a6c5e229] hover:text-[#b6c2cf]"
        >
          <Plus size={16} className="h-4 w-4" /> Add a card
        </Button>
      </div>
    </div>
  );
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = use(params);
  const [board, setBoard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = async () => {
    try {
      const res = await api.get(`/boards/${boardId}`);
      setBoard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const ws = new WebSocket(`ws://localhost:8003/api/v1/ws/board/${boardId}?token=${token}`);
    ws.onmessage = () => fetchData();
    return () => ws.close();
  }, [boardId]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'Card' && (overData?.type === 'List' || overData?.type === 'Card')) {
      const overListId = overData.type === 'List' ? over.id : overData.card.list_id;
      const activeListId = activeData.card.list_id;

      if (activeListId !== overListId) {
        setBoard((prev: any) => {
          const activeList = prev.lists.find((l: any) => l.id === activeListId);
          const movingCard = activeList.cards.find((c: any) => c.id === active.id);
          if (!movingCard) return prev;
          
          movingCard.list_id = overListId;

          return {
            ...prev,
            lists: prev.lists.map((l: any) => {
              if (l.id === activeListId) {
                return { ...l, cards: l.cards.filter((c: any) => c.id !== active.id) };
              }
              if (l.id === overListId) {
                return { ...l, cards: [...l.cards.filter((c: any) => c.id !== active.id), movingCard] };
              }
              return l;
            })
          };
        });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeData = active.data.current;
    if (activeData?.type === 'Card') {
      const cardId = active.id;
      const listId = activeData.card.list_id;
      try {
        await api.put(`/cards/${cardId}`, { list_id: listId });
      } catch (err) {
        fetchData();
      }
    }
  };

  const handleAddCard = async (listId: string) => {
    const title = prompt('Enter card title:');
    if (!title) return;
    try {
      await api.post('/cards/', { title, list_id: listId });
      fetchData();
    } catch (err) {
      alert('Failed to add card');
    }
  };

  if (isLoading || !board) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-zinc-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#1d2125] text-[#b6c2cf] font-sans selection:bg-[#0055cc] selection:text-white">
       <header className="h-[48px] border-b border-[#384148] px-4 flex items-center justify-between bg-[#1d2125]/90 backdrop-blur-sm z-[100] shrink-0">
          <div className="flex items-center gap-4">
             <div className="hover:bg-[#a6c5e229] p-1.5 rounded transition-colors cursor-pointer">
                <Layout size={18} className="text-[#9fadbc]" />
             </div>
             <h1 className="text-[18px] font-black tracking-tight text-[#b6c2cf] hover:text-white cursor-pointer transition-colors">STRONTIUM</h1>
             
             <div className="flex items-center gap-1 ml-4 hidden md:flex">
                <Button className="bg-[#0055cc] hover:bg-[#0747a6]">
                  <Plus size={14} className="mr-1 h-3 w-3" /> Create
                </Button>
                <Button variant="ghost" className="bg-[#a6c5e229]">
                  Recent <MoreHorizontal size={14} className="mt-0.5" />
                </Button>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9fadbc]" />
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-[#22272b] border-[#384148] h-8 pl-8 w-[200px] text-sm"
                />
             </div>
             <div className="flex items-center gap-1">
                <Button variant="ghost" className="p-2 text-[#9fadbc] hover:bg-[#a6c5e229]"><Bell size={18} /></Button>
                <Button variant="ghost" className="p-2 text-[#9fadbc] hover:bg-[#a6c5e229]"><Settings size={18} /></Button>
                <Avatar className="h-8 w-8 bg-indigo-600">
                  <AvatarFallback className="font-bold text-sm bg-indigo-600">LA</AvatarFallback>
                </Avatar>
             </div>
          </div>
       </header>

       <div className="h-[56px] px-4 flex items-center justify-between bg-[#1d2125]/40 backdrop-blur-sm border-b border-[#384148]/50 shrink-0">
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               onClick={() => router.push('/workspaces')}
               className="p-1.5 hover:bg-[#a6c5e229] text-[#9fadbc]"
             >
                <ChevronLeft size={20} />
             </Button>
             <h2 className="text-[18px] font-bold text-white px-3 py-1.5 hover:bg-[#a6c5e229] rounded cursor-pointer transition-colors">{board.title}</h2>
             
             <div className="flex items-center gap-1 ml-2">
                <Button variant="ghost" size="sm" className="p-2 text-[#9fadbc] hover:bg-[#a6c5e229]"><CheckCircle2 size={16} /></Button>
                <Button variant="ghost" size="sm" className="text-[#b6c2cf] px-3">
                  <LayoutGrid size={14} className="mr-1 h-3 w-3" /> Board
                </Button>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="flex -space-x-1.5 mr-2">
                <Avatar className="h-7 w-7 bg-emerald-600 ring-2 ring-[#1d2125]">
                  <AvatarFallback className="text-[10px] font-bold bg-emerald-600 uppercase">JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-7 w-7 bg-amber-600 ring-2 ring-[#1d2125]">
                  <AvatarFallback className="text-[10px] font-bold bg-amber-600 uppercase">MK</AvatarFallback>
                </Avatar>
                <Avatar className="h-7 w-7 bg-rose-600 ring-2 ring-[#1d2125]">
                  <AvatarFallback className="text-[10px] font-bold bg-rose-600 uppercase">SH</AvatarFallback>
                </Avatar>
             </div>
             <Button variant="outline" className="bg-[#dfe1e6] hover:bg-[#ebecf0] text-[#172b4d] border-[#dfe1e6] hover:border-[#ebecf0]">
                <Plus size={14} className="mr-1 h-3 w-3" /> Share
             </Button>
          </div>
       </div>

       <DndContext 
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragStart={handleDragStart}
         onDragOver={handleDragOver}
         onDragEnd={handleDragEnd}
       >
          <main 
             className="flex-1 overflow-x-auto overflow-y-hidden p-3 flex gap-4 items-start scrollbar-thin select-none"
             style={{ 
                backgroundColor: board.background || '#1d2125',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1))',
             }}
           >
             <SortableContext items={board.lists.map((l: any) => l.id)}>
               {board.lists.map((list: any) => (
                 <DroppableList 
                   key={list.id} 
                   list={list} 
                   cards={list.cards} 
                   onAddCard={handleAddCard}
                 />
               ))}
             </SortableContext>

             <Button 
               variant="outline" 
               className="w-[272px] shrink-0 h-10 bg-[#ffffff3d] hover:bg-[#ffffff52] backdrop-blur-md text-white border-transparent hover:border-transparent shadow-sm"
             >
                <Plus size={18} className="mr-1 h-4 w-4" /> Add another list
             </Button>
          </main>

          <DragOverlay>
             {activeId ? (
               <div className="bg-[#22272b] border border-[#454f59] rounded-lg p-3 shadow-2xl opacity-90 scale-105 rotate-3 pointer-events-none">
                  <div className="h-2 w-10 rounded-full bg-indigo-500 mb-2" />
                  <h4 className="text-[14px] text-[#b6c2cf] font-medium leading-[20px]">Moving Card...</h4>
               </div>
             ) : null}
          </DragOverlay>
       </DndContext>

       <style>{`
          .scrollbar-thin::-webkit-scrollbar { height: 12px; width: 12px; }
          .scrollbar-thin::-webkit-scrollbar-track { background: #00000021; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: #ffffff3d; border-radius: 6px; border: 3px solid transparent; background-clip: content-box; }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #ffffff52; border-radius: 6px; border: 3px solid transparent; background-clip: content-box; }
          
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff14; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff29; }
       `}</style>
    </div>
  );
}
