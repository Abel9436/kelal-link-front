"use client";

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Trash2, Plus, Link as LinkIcon, Type, Sparkles, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPlatformInfo } from '@/lib/platforms';

interface LinkItem {
    id: string;
    label: string;
    url: string;
    isSpotlight?: boolean;
}

interface SortableItemProps {
    id: string;
    link: LinkItem;
    onUpdate: (id: string, field: 'label' | 'url', value: string) => void;
    onToggleSpotlight: (id: string) => void;
    onRemove: (id: string) => void;
    lang: 'en' | 'am';
    readOnly?: boolean;
}

function SortableItem({ id, link, onUpdate, onToggleSpotlight, onRemove, lang, readOnly }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            className={cn(
                "group relative glass-card p-4 rounded-3xl border-glass-stroke transition-all mb-4",
                isDragging ? "opacity-50 ring-2 ring-primary scale-105 shadow-2xl" : "hover:border-primary/20"
            )}
        >
            <div className="flex items-start gap-4">
                <div
                    {...attributes}
                    {...listeners}
                    className={cn(
                        "mt-3 p-2 rounded-xl text-primary/60 transition-colors",
                        readOnly ? "cursor-default opacity-20" : "cursor-grab active:cursor-grabbing hover:bg-glass-fill hover:text-primary"
                    )}
                >
                    <GripVertical size={20} />
                </div>

                <div className="flex-1 space-y-3">
                    <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within/input:text-neon transition-colors">
                            {React.createElement(getPlatformInfo(link.url).icon, { size: 16, className: getPlatformInfo(link.url).color })}
                        </div>
                        <input
                            type="text"
                            placeholder={lang === 'en' ? "Link Title (e.g. My Telegram)" : "የሊንኩ ስም (ለምሳሌ፡ የኔ ቴሌግራም)"}
                            value={link.label}
                            onChange={(e) => onUpdate(id, 'label', e.target.value)}
                            className="w-full bg-glass-fill border border-glass-stroke rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-neon focus:bg-background transition-all disabled:opacity-50"
                            disabled={readOnly}
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within/input:text-neon transition-colors">
                            <LinkIcon size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={link.url}
                            onChange={(e) => {
                                const val = e.target.value;
                                onUpdate(id, 'url', val);
                                if (!link.label) {
                                    const info = getPlatformInfo(val);
                                    if (info.label) onUpdate(id, 'label', info.label);
                                }
                            }}
                            className="w-full bg-glass-fill border border-glass-stroke rounded-2xl py-3 pl-12 pr-4 text-sm font-mono outline-none focus:border-neon focus:bg-background transition-all disabled:opacity-50"
                            disabled={readOnly}
                        />
                    </div>
                </div>

                {!readOnly && (
                    <div className="flex flex-col gap-2 mt-3">
                        <button
                            onClick={() => onToggleSpotlight(id)}
                            className={cn(
                                "p-3 rounded-2xl transition-all",
                                link.isSpotlight ? "bg-neon text-background shadow-lg shadow-neon/40" : "hover:bg-glass-fill text-primary/40 hover:text-neon"
                            )}
                            title={lang === 'en' ? "Spotlight Link" : "ሊንኩን አጉላ"}
                        >
                            <Sparkles size={20} className={link.isSpotlight ? "animate-pulse" : ""} />
                        </button>
                        <button
                            onClick={() => onRemove(id)}
                            className="p-3 rounded-2xl hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-all text-sm font-black"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

interface BundleBuilderProps {
    title: string;
    setTitle: (t: string) => void;
    description: string;
    setDescription: (d: string) => void;
    items: LinkItem[];
    setItems: (items: LinkItem[]) => void;
    lang: 'en' | 'am';
    readOnly?: boolean;
}

export function BundleBuilder({
    title,
    setTitle,
    description,
    setDescription,
    items,
    setItems,
    lang,
    readOnly
}: BundleBuilderProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const updateItem = (id: string, field: 'label' | 'url', value: string) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const toggleSpotlight = (id: string) => {
        // Only one item can be spotlighted at a time for focus
        setItems(items.map(item => ({
            ...item,
            isSpotlight: item.id === id ? !item.isSpotlight : false
        })));
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(36).substr(2, 9), label: '', url: '' }]);
    };

    const shuffleItems = () => {
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    };

    return (
        <div className="space-y-8">
            {/* Profile Section */}
            <div className="glass-card p-8 rounded-[40px] border-glass-stroke space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-neon/10 rounded-2xl text-neon">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight uppercase">
                        {lang === 'en' ? 'Bundle Identity' : 'የጥቅል ማንነት'}
                    </h3>
                </div>

                <div className="space-y-4">
                    <div className="relative group/input">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">
                            {lang === 'en' ? 'Bundle Title' : 'የጥቅል ስም'}
                        </label>
                        <input
                            type="text"
                            placeholder={lang === 'en' ? "My Social Hub" : "የኔ ማህበራዊ ገጽ"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-glass-fill border border-glass-stroke rounded-2xl py-4 px-6 text-lg font-black outline-none focus:border-neon focus:bg-background transition-all text-contrast disabled:opacity-50"
                            disabled={readOnly}
                        />
                    </div>

                    <div className="relative group/input">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-4 mb-2 block">
                            {lang === 'en' ? 'Bio / Description (Optional)' : 'መግለጫ (አማራጭ)'}
                        </label>
                        <textarea
                            placeholder={lang === 'en' ? "Welcome to my digital corner..." : "እንኳን ወደ ዲጂታል ገጼ በሰላም መጡ..."}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full bg-glass-fill border border-glass-stroke rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-neon focus:bg-background transition-all resize-none disabled:opacity-50"
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/70">
                        {lang === 'en' ? 'DRAGGABLE LINKS' : 'ተንቀሳቃሽ ሊንኮች'}
                    </h4>
                    <div className="flex items-center gap-6">
                        {!readOnly && (
                            <button
                                onClick={shuffleItems}
                                className="flex items-center gap-2 text-[10px] font-black text-primary/40 hover:text-neon transition-colors uppercase tracking-widest group/shuffle"
                            >
                                <Shuffle size={12} className="group-hover/shuffle:rotate-180 transition-transform duration-500" />
                                {lang === 'en' ? 'SHUFFLE Order' : 'ቅደም ተከተል ቀይር'}
                            </button>
                        )}
                        <span className="text-[10px] font-black text-neon">{items.length} LINKS</span>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={readOnly ? undefined : handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                link={item}
                                onUpdate={updateItem}
                                onToggleSpotlight={toggleSpotlight}
                                onRemove={removeItem}
                                lang={lang}
                                readOnly={readOnly}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {!readOnly && (
                    <button
                        onClick={addItem}
                        className="w-full py-6 rounded-3xl border-2 border-dashed border-glass-stroke text-primary/70 hover:border-neon hover:text-neon hover:bg-neon/5 transition-all font-black flex items-center justify-center gap-3 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        {lang === 'en' ? 'ADD ANOTHER LINK' : 'ሌላ ሊንክ ጨምር'}
                    </button>
                )}
            </div>
        </div>
    );
}
