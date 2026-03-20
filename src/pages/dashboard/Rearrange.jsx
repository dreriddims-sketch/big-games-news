/* src/pages/dashboard/Rearrange.jsx */
import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, Trash2, Calendar, Eye, ArrowLeft } from 'lucide-react';
import { mockDB, saveToMockPosts } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const SortableItem = ({ id, post }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="premium-card bg-white/5 border-white/5 p-4 flex items-center gap-6 group hover:border-primary/20 transition-all hover:translate-x-2"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-3 glass rounded-xl text-text-secondary hover:text-primary transition-colors">
        <GripVertical size={24} />
      </button>
      
      <img src={post.banner_url} className="w-24 h-16 rounded-xl object-cover shadow-2xl border border-white/10" />
      
      <div className="flex-1 space-y-1">
        <h4 className="text-lg font-black uppercase text-white tracking-tight leading-tight transition-all italic truncate">
           {post.title}
        </h4>
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-1.5 text-[10px] text-text-secondary uppercase font-black tracking-widest leading-none">
             <Calendar size={12} className="text-primary" /> {new Date(post.created_at).toLocaleDateString()}
           </span>
           <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 uppercase font-black tracking-widest leading-none">
             <Eye size={12} /> Live Post
           </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <button className="p-3 glass rounded-xl hover:text-primary transition-all">
            <Save size={18} />
         </button>
         <button className="p-3 glass rounded-xl hover:text-red-500 transition-all">
            <Trash2 size={18} />
         </button>
      </div>
    </div>
  );
};

const Rearrange = () => {
  const [items, setItems] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(mockDB.posts.map(p => ({ ...p, id: p.id.toString() })));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(prev, oldIndex, newIndex);
        
        // Save to mock DB
        saveToMockPosts(newArray.map(p => ({ ...p, id: parseInt(p.id) })));
        return newArray;
      });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link to="/dashboard/articles" className="p-3 glass rounded-2xl hover:text-primary transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Live Feed Order</h2>
              <p className="text-base text-text-secondary font-medium pl-1">Drag and drop to rearrange articles on the live news page.</p>
           </div>
        </div>
        <button className="btn-primary py-3 flex items-center gap-2 text-xs uppercase font-black">
          <Save size={18} /> Commit Live Order
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((post) => (
              <SortableItem key={post.id} id={post.id} post={post} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="premium-card p-12 bg-white/5 border-dashed border-2 border-white/5 text-center space-y-2 opacity-50">
         <p className="text-sm font-black uppercase tracking-widest">End of Article Stream</p>
         <p className="text-xs text-text-secondary">Changes in the rearrange tool are pushed to the live homepage instantly.</p>
      </div>
    </div>
  );
};

export default Rearrange;
