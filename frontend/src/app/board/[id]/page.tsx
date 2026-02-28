'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  Cpu,
  LayoutGrid,
  LogOut
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
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '@/lib/api';

// --- Sortable Card Item Component ---
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
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 group hover:border-zinc-500 cursor-grab active:cursor-grabbing shadow-xl transition-colors"
    >
      {card.priority === 'high' && <div className="w-8 h-1 bg-rose-500 rounded-full mb-3" />}
      <h4 className="text-sm font-bold mb-3 leading-snug">{card.title}</h4>
      
      <div className="flex items-center gap-4 text-zinc-600">
        {card.due_date && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <Calendar size={12} /> {new Date(card.due_date).toLocaleDateString()}
          </div>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <MessageSquare size={12} />
          <Paperclip size={12} />
        </div>
      </div>
    </div>
  );
}

// --- List Container Component ---
function DroppableList({ list, cards }: { list: any; cards: any[] }) {
  const {
    setNodeRef,
    isDragging: isListDragging,
  } = useSortable({ id: list.id, data: { list, type: 'List' } });

  return (
    <div 
      ref={setNodeRef}
      className="w-[320px] shrink-0 flex flex-col max-h-full"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">{list.title}</h3>
        <button className="text-zinc-700 hover:text-white"><MoreHorizontal size={18} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-[50px]">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>

        <button className="w-full py-4 border border-dashed border-zinc-800 rounded-2xl text-[10px] font-black text-zinc-700 hover:text-white hover:border-zinc-500 transition-all flex items-center justify-center gap-2">
          <Plus size={14} /> ADD COMPONENT
        </button>
      </div>
    </div>
  );
}

// --- Main Board Component ---
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
    const ws = new WebSocket(`ws://localhost:8003/api/v1/ws/board/${boardId}?token=${localStorage.getItem('token')}`);
    ws.onmessage = (event) => {
      fetchData();
    };
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

    // Moving card between lists
    if (activeData?.type === 'Card' && (overData?.type === 'List' || overData?.type === 'Card')) {
      const overListId = overData.type === 'List' ? over.id : overData.card.list_id;
      const activeListId = activeData.card.list_id;

      if (activeListId !== overListId) {
        setBoard((prev: any) => {
          const activeList = prev.lists.find((l: any) => l.id === activeListId);
          const overList = prev.lists.find((l: any) => l.id === overListId);
          const movedCard = activeList.cards.find((c: any) => c.id === active.id);

          movedCard.list_id = overListId; // Optimistic update

          return {
            ...prev,
            lists: prev.lists.map((l: any) => {
              if (l.id === activeListId) {
                return { ...l, cards: l.cards.filter((c: any) => c.id !== active.id) };
              }
              if (l.id === overListId) {
                return { ...l, cards: [...l.cards, movedCard] };
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

      // Persist to backend
      try {
        await api.put(`/cards/${cardId}`, { list_id: listId });
      } catch (err) {
        console.error("Failed to sync card movement", err);
        fetchData();
      }
    }
  };

  if (isLoading || !board) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="animate-spin text-zinc-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
       <header className="h-[80px] border-b border-[#18181b] px-8 flex items-center justify-between sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-6">
             <h2 className="text-xl font-black uppercase tracking-tight">{board.title}</h2>
             <div className="h-4 w-px bg-zinc-800" />
             <nav className="flex items-center gap-2">
                <button 
                  onClick={() => router.push('/workspaces')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-white font-bold text-xs"
                >
                  <ArrowBackIcon /> BACK
                </button>
             </nav>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => fetchData()} className="text-zinc-700 hover:text-white p-2"><Loader2 size={16} /></button>
             <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black shadow-lg">SHARE</button>
          </div>
       </header>

       <DndContext 
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragStart={handleDragStart}
         onDragOver={handleDragOver}
         onDragEnd={handleDragEnd}
       >
         <main className="flex-1 overflow-x-auto p-10 flex gap-8 items-start scrollbar-hide">
            <SortableContext items={board.lists.map((l: any) => l.id)}>
              {board.lists.map((list: any) => (
                <DroppableList key={list.id} list={list} cards={list.cards} />
              ))}
            </SortableContext>

            <button className="w-[320px] shrink-0 h-16 bg-[#18181b]/50 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-zinc-700 hover:text-white transition-all">
               <Plus size={18} /> INITIALIZE NEW CATEGORY
            </button>
         </main>

         <DragOverlay>
            {activeId ? (
              <div className="bg-[#18181b] border border-white/20 rounded-2xl p-5 shadow-2xl opacity-90 scale-105">
                 <h4 className="text-sm font-bold text-white">Shifting Component...</h4>
              </div>
            ) : null}
         </DragOverlay>
       </DndContext>

       <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
       `}</style>
    </div>
  );
}

function ArrowBackIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  );
}
