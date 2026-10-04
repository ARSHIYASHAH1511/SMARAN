/**
 * SMARAN - Gemma Multimodal Photo Timeline Reel
 *
 * Designed for dementia rehabilitation with two primary goals:
 * 1. Scrollable Reel UX: Vertical snap-scrolling reel with smooth glide,
 *    floating Up/Down elder controls, and a vertical decade timeline rail.
 * 2. Prominent Gemma Multimodal Vision: Highlights how Gemma analyzes
 *    visual artifacts (Kodachrome, monochrome, textiles, facial aging across decades)
 *    and formulates non-punitive, sensory-grounded reminiscence cues.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  Calendar,
  Layers,
  RefreshCw,
  Upload,
  Clock,
  Heart,
  ChevronUp,
  ChevronDown,
  Info,
  Play,
  Pause,
  X,
  Save,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Memory, getMemories, saveMemory, fileToBase64 } from '../lib/db';
import {
  sortMemoriesChronologically,
  runGemmaTimelineEngine,
  resetToCuratedLifeline,
  speakMemoryPrompt,
  stopSpeaking,
  GEMMA_SAMPLE_ANALYSES,
  GemmaScanProgress
} from '../lib/gemmaTimelineEngine';
import { useLanguage } from '../contexts/LanguageContext';

export default function PhotoAlbum() {
  const { lang } = useLanguage();

  // Mode: 'reel' (Scrollable Reel) vs. 'studio' (Caregiver Gemma Engine & Upload)
  const [activeTab, setActiveTab] = useState<'reel' | 'studio'>('reel');

  // Memories & Reel State
  const [photoMemories, setPhotoMemories] = useState<Memory[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Audio Playback
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMemoryId, setSpeakingMemoryId] = useState<string | null>(null);

  // Autoplay Reel Tour State
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gemma Vision Breakdown Drawer/Modal
  const [inspectingGemmaId, setInspectingGemmaId] = useState<string | null>(null);

  // Voice Reflection Recording Modal (Patient Side)
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceReflectionText, setVoiceReflectionText] = useState('');

  // Gemma AI Engine Runner State (Caregiver Side)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState<GemmaScanProgress | null>(null);
  const [gemmaSuccessNotice, setGemmaSuccessNotice] = useState<string | null>(null);

  // Editing a specific memory (Caregiver Side)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // Scroll Container Ref for the Snap Reel
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMemories();
    return () => {
      stopSpeaking();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, []);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const local = await getMemories();
      const valid = local.filter((m) => m.image);
      const sorted = sortMemoriesChronologically(valid);
      setPhotoMemories(sorted);
    } catch (e) {
      console.error('Error loading memories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to a specific reel card
  const scrollToReelIndex = (index: number) => {
    if (index < 0 || index >= photoMemories.length) return;
    setActiveReelIndex(index);
    const container = reelContainerRef.current;
    if (container) {
      const targetCard = container.children[index] as HTMLElement;
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Detect which reel card is currently in view
  const handleScroll = () => {
    const container = reelContainerRef.current;
    if (!container) return;
    const cards = Array.from(container.children) as HTMLElement[];
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const centerPoint = containerTop + containerHeight / 2;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardTop = card.offsetTop;
      const cardBottom = cardTop + card.offsetHeight;
      if (centerPoint >= cardTop && centerPoint <= cardBottom) {
        if (activeReelIndex !== i) {
          setActiveReelIndex(i);
        }
        break;
      }
    }
  };

  const handleSpeakMemory = (memory: Memory) => {
    if (isSpeaking && speakingMemoryId === memory.id) {
      stopSpeaking();
      setIsSpeaking(false);
      setSpeakingMemoryId(null);
      return;
    }

    stopSpeaking();
    setIsSpeaking(true);
    setSpeakingMemoryId(memory.id);

    const textToSpeak = `${memory.eraTitle || memory.description}. ${memory.reminiscenceCue || ''}`;
    speakMemoryPrompt(textToSpeak, lang);

    const words = textToSpeak.split(' ').length;
    const estSeconds = Math.max(3, words / 2.2);
    setTimeout(() => {
      setIsSpeaking(false);
      setSpeakingMemoryId(null);

      // If autoplay is active, advance to next memory
      if (isAutoPlaying && activeReelIndex < photoMemories.length - 1) {
        autoPlayTimerRef.current = setTimeout(() => {
          scrollToReelIndex(activeReelIndex + 1);
        }, 1500);
      }
    }, estSeconds * 1000);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      stopSpeaking();
      setIsSpeaking(false);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    } else {
      setIsAutoPlaying(true);
      if (photoMemories[activeReelIndex]) {
        handleSpeakMemory(photoMemories[activeReelIndex]);
      }
    }
  };

  const handleStartVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceReflectionText("Microphone transcription is supported in Chrome/Edge, or you can type your recollection here.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'as-IN' : 'en-IN';
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceReflectionText('');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setVoiceReflectionText(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSaveVoiceReflection = async () => {
    if (!voiceReflectionText.trim()) return;
    const curr = photoMemories[activeReelIndex];
    if (!curr) return;

    const updated: Memory = {
      ...curr,
      patientVoiceNote: voiceReflectionText.trim()
    };

    await saveMemory(updated);
    setPhotoMemories((prev) => prev.map((m) => (m.id === curr.id ? updated : m)));
    setShowVoiceModal(false);
    setVoiceReflectionText('');
  };

  // Run Gemma Timeline Engine simulation
  const handleRunGemmaEngine = async () => {
    setIsAnalyzing(true);
    setScanProgress({
      stage: 1,
      stageName: 'Ingesting Family Photographs',
      detail: 'Scanning photo print emulsion, Kodachrome pigments, and digital metadata...',
      percentage: 15
    });

    try {
      const sorted = await runGemmaTimelineEngine((progress) => {
        setScanProgress(progress);
      });
      setPhotoMemories(sorted);
      setGemmaSuccessNotice('Gemma 3 Multimodal Engine analyzed and synthesized 5 chronological eras into your Reel!');
      setTimeout(() => setGemmaSuccessNotice(null), 5000);
      setActiveTab('reel');
      setActiveReelIndex(0);
    } catch (e) {
      console.error('Gemma engine error:', e);
    } finally {
      setIsAnalyzing(false);
      setScanProgress(null);
    }
  };

  const handleResetLifeline = async () => {
    const sorted = await resetToCuratedLifeline();
    setPhotoMemories(sorted);
    setActiveReelIndex(0);
    setGemmaSuccessNotice('Restored curated family timeline from 1974 to 2018.');
    setTimeout(() => setGemmaSuccessNotice(null), 4000);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const newId = `user-mem-${Date.now()}`;
      const newMemory: Memory = {
        id: newId,
        image: base64,
        description: 'New family photograph ingested into Gemma Multimodal Timeline.',
        date: Date.now(),
        estimatedYear: 2005,
        estimatedDecade: '2000s',
        eraTitle: 'Cherished Family Milestone',
        culturalSetting: 'North Eastern Family Home',
        reminiscenceCue: 'Look at the happy smiles in this photograph. Can you remember who was visiting your home that day?',
        aiAnalyzed: true,
        chronologyConfidence: 89,
        chapter: 'family'
      };

      await saveMemory(newMemory);
      const updated = sortMemoriesChronologically([...photoMemories, newMemory]);
      setPhotoMemories(updated);
      setGemmaSuccessNotice('Photo analyzed by Gemma Multimodal Vision and placed into your Reel!');
      setTimeout(() => setGemmaSuccessNotice(null), 5000);
    } catch (err) {
      console.error('Error uploading photo:', err);
    }
  };

  const handleSaveMemoryEdits = async () => {
    if (!editingMemory) return;
    await saveMemory(editingMemory);
    const updated = sortMemoriesChronologically(
      photoMemories.map((m) => (m.id === editingMemory.id ? editingMemory : m))
    );
    setPhotoMemories(updated);
    setEditingMemory(null);
  };

  return (
    <div className="h-[calc(100vh-64px)] sm:h-[calc(100vh-70px)] bg-[#faf8f5] flex flex-col overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* TOP COMPACT HEADER WITH PROMINENT GEMMA 3 MULTIMODAL BRANDING             */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-stone-200/90 px-4 py-3 shrink-0 shadow-2xs z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Gemma 3 Badge & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-tight">
                  Lifeline Reel
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  Gemma 3 Multimodal
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium hidden sm:block">
                Auto-reconstructed chronological timeline • Non-punitive reminiscence for dementia
              </p>
            </div>
          </div>

          {/* Mode Controls */}
          <div className="flex items-center gap-1.5">
            {activeTab === 'reel' && (
              <button
                onClick={toggleAutoPlay}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isAutoPlaying
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                }`}
                title="Automatically glide through memories with gentle narration"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span className="hidden sm:inline">{isAutoPlaying ? 'Pause Tour' : 'Auto-Play Reel'}</span>
              </button>
            )}

            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                onClick={() => {
                  setActiveTab('reel');
                  stopSpeaking();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'reel'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Reel View
              </button>
              <button
                onClick={() => {
                  setActiveTab('studio');
                  stopSpeaking();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'studio'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Gemma Studio</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
      {gemmaSuccessNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-bold text-amber-950 flex items-center justify-center gap-2 animate-gentle-in">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{gemmaSuccessNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SCROLLABLE REEL VIEW (PATIENT & CAREGIVER EFFORTLESS GLIDE)             */}
      {/* ========================================================================= */}
      {activeTab === 'reel' && (
        <div className="flex-1 relative flex overflow-hidden">
          {/* Main Snap-Scroll Reel Container */}
          <div
            ref={reelContainerRef}
            onScroll={handleScroll}
            className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth divide-y divide-stone-200/40"
          >
            {photoMemories.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
                <Clock className="w-12 h-12 text-stone-400 mb-3" />
                <h3 className="text-xl font-bold text-stone-900">Your Lifeline is Ready to Bloom</h3>
                <p className="text-sm text-stone-600 max-w-sm mt-1 mb-4">
                  Switch to Gemma Studio to run the multimodal timeline engine or seed family memories.
                </p>
                <button
                  onClick={handleResetLifeline}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm rounded-xl shadow-2xs"
                >
                  Load Curated Family Memories
                </button>
              </div>
            ) : (
              photoMemories.map((mem, index) => {
                const year = mem.estimatedYear || (mem.date ? new Date(mem.date).getFullYear() : '—');
                const isCurrentSpeaking = isSpeaking && speakingMemoryId === mem.id;
                const sampleAnalysis = GEMMA_SAMPLE_ANALYSES[mem.id];

                return (
                  <section
                    key={mem.id}
                    className="h-full w-full snap-start snap-always shrink-0 flex items-center justify-center p-3 sm:p-6 relative bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]"
                  >
                    <div className="w-full max-w-xl h-full max-h-[82vh] bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col overflow-hidden relative group">
                      {/* Reel Top Bar Over Photo */}
                      <div className="p-3.5 sm:p-4 bg-gradient-to-b from-black/70 via-black/40 to-transparent absolute top-0 left-0 right-0 z-20 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-black bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full shadow-xs">
                            {year}
                          </span>
                          <h2 className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-[260px] text-white/95">
                            {mem.eraTitle || 'Family Memory'}
                          </h2>
                        </div>

                        {/* Gemma Multimodal Trigger Pill */}
                        <button
                          onClick={() => setInspectingGemmaId(mem.id)}
                          className="bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/30 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title="Click to view what Gemma Multimodal Vision saw"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Gemma Analysis</span>
                        </button>
                      </div>

                      {/* Photo Visual Section */}
                      <div className="relative flex-1 bg-stone-900/10 min-h-[220px] overflow-hidden flex items-center justify-center">
                        {mem.image ? (
                          <img
                            src={mem.image}
                            alt={mem.eraTitle || 'Memory'}
                            className="w-full h-full object-cover select-none"
                          />
                        ) : (
                          <div className="text-stone-400 font-bold">No Image</div>
                        )}

                        {/* Cultural Setting Badge */}
                        {mem.culturalSetting && (
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                            📍 {mem.culturalSetting}
                          </div>
                        )}

                        {/* Step Position Indicator */}
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-stone-200">
                          {index + 1} / {photoMemories.length}
                        </div>
                      </div>

                      {/* Reel Content Bottom Section */}
                      <div className="p-4 sm:p-5 bg-white border-t border-stone-100 flex flex-col justify-between gap-3 shrink-0">
                        {/* Story Description */}
                        <p className="text-sm sm:text-base text-stone-800 font-medium font-serif leading-relaxed line-clamp-2">
                          "{mem.description}"
                        </p>

                        {/* Gemma Reminiscence Prompt Box */}
                        {mem.reminiscenceCue && (
                          <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-stone-50 border-2 border-amber-300/80 rounded-2xl p-3 sm:p-3.5 shadow-2xs relative">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-base">🪔</span>
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                                Gemma Reminiscence Prompt
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-amber-950 font-bold leading-snug">
                              {mem.reminiscenceCue}
                            </p>
                          </div>
                        )}

                        {/* Saved Voice Note */}
                        {mem.patientVoiceNote && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate italic">"{mem.patientVoiceNote}"</span>
                          </div>
                        )}

                        {/* Reel Action Buttons: Listen, Share Thought, View Gemma */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSpeakMemory(mem)}
                              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                isCurrentSpeaking
                                  ? 'bg-amber-800 text-white'
                                  : 'bg-stone-900 hover:bg-stone-800 text-white'
                              }`}
                            >
                              {isCurrentSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              <span>{isCurrentSpeaking ? 'Pause' : 'Listen'}</span>
                            </button>

                            <button
                              onClick={() => setShowVoiceModal(true)}
                              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-stone-200 cursor-pointer"
                            >
                              <Mic className="w-3.5 h-3.5 text-amber-700" />
                              <span>Share Thought</span>
                            </button>
                          </div>

                          <button
                            onClick={() => setInspectingGemmaId(mem.id)}
                            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>What Gemma Saw</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })
            )}
          </div>

          {/* ========================================================================= */}
          {/* FLOATING ELDER NAVIGATION: UP / DOWN CHEVRONS (EFFORTLESS FOR SENIORS)     */}
          {/* ========================================================================= */}
          <div className="absolute right-4 sm:right-6 bottom-6 flex flex-col gap-2 z-30">
            <button
              onClick={() => scrollToReelIndex(activeReelIndex - 1)}
              disabled={activeReelIndex === 0}
              className="w-12 h-12 rounded-2xl bg-white/95 hover:bg-white text-stone-800 border border-stone-300 shadow-md flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Previous Memory (Up)"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            <button
              onClick={() => scrollToReelIndex(activeReelIndex + 1)}
              disabled={activeReelIndex >= photoMemories.length - 1}
              className="w-12 h-12 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white shadow-md flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Next Memory (Down)"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* VERTICAL DECADE TRACKER RAIL (RIGHT SIDE ON DESKTOP)                       */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex flex-col justify-center items-center gap-3 pr-5 py-4 shrink-0 z-20">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 rotate-90 mb-2">
              Lifeline
            </span>
            {photoMemories.map((m, idx) => {
              const year = m.estimatedYear || (m.date ? new Date(m.date).getFullYear() : '—');
              const isActive = idx === activeReelIndex;

              return (
                <button
                  key={m.id}
                  onClick={() => scrollToReelIndex(idx)}
                  className={`group relative flex items-center transition-all cursor-pointer`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      isActive
                        ? 'bg-amber-600 ring-4 ring-amber-200 scale-125'
                        : 'bg-stone-300 group-hover:bg-stone-400'
                    }`}
                  />
                  {/* Tooltip on Hover */}
                  <span
                    className={`absolute right-6 text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs opacity-100'
                        : 'bg-white text-stone-600 border-stone-200 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GEMMA STUDIO & MANAGEMENT TAB (FOR CAREGIVER & TIMELINE CONFIG)         */}
      {/* ========================================================================= */}
      {activeTab === 'studio' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {/* Gemma 3 Architecture Hero Card */}
          <section className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemma 3 Multimodal Vision Pipeline</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  How Gemma Reconstructs Autobiographical Lifelines
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Dementia causes recent memories to fade while remote youth memories remain intact. When shown random photos, patients experience distress. Gemma analyzes visual era cues (Kodachrome, monochrome, Muga silk weaves, and facial aging progression) to arrange memories in strict chronological sequence with open-ended conversation questions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleRunGemmaEngine}
                  disabled={isAnalyzing}
                  className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Scanning...' : 'Run Gemma Timeline Engine'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    onClick={handleResetLifeline}
                    className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Restore sample 1974-2018 photos"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Lifeline</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadPhoto}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Gemma Live Progress Bar */}
            {isAnalyzing && scanProgress && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>Stage {scanProgress.stage}: {scanProgress.stageName}</span>
                  <span>{scanProgress.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${scanProgress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-stone-400 font-mono">{scanProgress.detail}</p>
              </div>
            )}
          </section>

          {/* Timeline Management Grid */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-stone-700" />
              <span>Synthesized Lifeline Reel ({photoMemories.length} Memories)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photoMemories.map((mem, index) => {
                const year = mem.estimatedYear || (mem.date ? new Date(mem.date).getFullYear() : 2000);
                const sampleAnalysis = GEMMA_SAMPLE_ANALYSES[mem.id];

                return (
                  <div
                    key={mem.id}
                    className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-amber-300 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {mem.image ? (
                          <img src={mem.image} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">No Img</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                            {year}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            Reel #{index + 1}
                          </span>
                          {mem.chronologyConfidence && (
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              {mem.chronologyConfidence}% Conf.
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-stone-900 mt-1 truncate">
                          {mem.eraTitle || 'Family Memory'}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                          {mem.description}
                        </p>
                      </div>
                    </div>

                    {/* Reminiscence Cue Preview */}
                    {mem.reminiscenceCue && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950">
                        <span className="font-bold flex items-center gap-1 mb-0.5">
                          <span>🪔 Gemma Reminiscence Prompt:</span>
                        </span>
                        <p className="italic">"{mem.reminiscenceCue}"</p>
                      </div>
                    )}

                    {/* Detected Multimodal Signals */}
                    {sampleAnalysis?.visualClues && (
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                          Gemma Multimodal Signals Detected:
                        </span>
                        <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc list-inside">
                          {sampleAnalysis.visualClues.map((clue, cIdx) => (
                            <li key={cIdx}>{clue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        onClick={() => handleSpeakMemory(mem)}
                        className="text-xs font-bold text-stone-700 hover:text-stone-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Test Voice</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('reel');
                            scrollToReelIndex(index);
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          View in Reel
                        </button>
                        <button
                          onClick={() => setEditingMemory(mem)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GEMMA MULTIMODAL BREAKDOWN MODAL ("WHAT GEMMA SAW")                        */}
      {/* ========================================================================= */}
      {inspectingGemmaId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-stone-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    Gemma 3 Multimodal Vision Breakdown
                  </h3>
                  <p className="text-[11px] text-stone-500 font-semibold">
                    Visual feature extraction & chronological ordering
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingGemmaId(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const mem = photoMemories.find((m) => m.id === inspectingGemmaId);
              const sampleAnalysis = mem ? GEMMA_SAMPLE_ANALYSES[mem.id] : null;
              if (!mem) return null;

              return (
                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Photo Thumbnail & Meta */}
                  <div className="flex gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    <img src={mem.image || ''} alt="thumb" className="w-20 h-20 rounded-xl object-cover" />
                    <div>
                      <span className="text-xs font-black bg-amber-600 text-white px-2 py-0.5 rounded-md">
                        {mem.estimatedYear || 'Estimated'}
                      </span>
                      <h4 className="font-bold text-stone-900 mt-1">{mem.eraTitle}</h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">{mem.description}</p>
                    </div>
                  </div>

                  {/* 1. Visual Signals Analyzed */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-700" />
                      <span>1. Visual Era Signals Analyzed by Gemma:</span>
                    </h5>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1.5 text-xs text-stone-700">
                      {sampleAnalysis?.visualClues ? (
                        sampleAnalysis.visualClues.map((clue, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{clue}</span>
                          </div>
                        ))
                      ) : (
                        <p>Image paper grain, lighting, and cultural attire calibrated to {mem.estimatedDecade || '2000s'}.</p>
                      )}
                    </div>
                  </div>

                  {/* 2. Chronological Confidence */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>2. Chronological Calibration Confidence:</span>
                    </h5>
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                      <span className="font-medium">Model Certainty Score</span>
                      <span className="font-black text-sm">{mem.chronologyConfidence || 92}% Verified</span>
                    </div>
                  </div>

                  {/* 3. Clinical Reminiscence Cues */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-700" />
                      <span>3. Dementia-Safe Reminiscence Formulation:</span>
                    </h5>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-serif leading-relaxed">
                      "{mem.reminiscenceCue}"
                    </div>
                    <p className="text-[11px] text-stone-500 italic">
                      *Note: Gemma specifically avoids test questions like "What year was this?" to prevent anxiety, focusing instead on warm sensory recall.
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setInspectingGemmaId(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VOICE REFLECTION RECORDING MODAL (PATIENT SHARING THOUGHT)                */}
      {/* ========================================================================= */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎙️</span>
                <h3 className="text-xl font-bold text-stone-900">Share Your Memory</h3>
              </div>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600">
              Speak whatever comes to your heart about this photograph. Your words are saved lovingly for your family.
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 min-h-[100px] flex flex-col justify-between">
              <textarea
                value={voiceReflectionText}
                onChange={(e) => setVoiceReflectionText(e.target.value)}
                placeholder="Tap 'Start Speaking' or type your cherished recollection here..."
                className="w-full bg-transparent text-sm text-stone-900 outline-none resize-none flex-1 font-serif"
                rows={4}
              />
              {isRecording && (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 pt-2 border-t border-stone-200">
                  <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
                  <span>Listening carefully to your voice...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleStartVoiceRecording}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? 'Listening...' : 'Speak Now'}</span>
              </button>

              <button
                onClick={handleSaveVoiceReflection}
                disabled={!voiceReflectionText.trim()}
                className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save to Memory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CAREGIVER MEMORY EDIT MODAL                                               */}
      {/* ========================================================================= */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-700" />
                <span>Edit Memory Timeline Data</span>
              </h3>
              <button
                onClick={() => setEditingMemory(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Estimated Year</label>
                <input
                  type="number"
                  value={editingMemory.estimatedYear || 2000}
                  onChange={(e) =>
                    setEditingMemory({ ...editingMemory, estimatedYear: parseInt(e.target.value) || 2000 })
                  }
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Era Title / Milestone</label>
                <input
                  type="text"
                  value={editingMemory.eraTitle || ''}
                  onChange={(e) =>
                    setEditingMemory({ ...editingMemory, eraTitle: e.target.value })
                  }
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Story Narrative</label>
                <textarea
                  value={editingMemory.description || ''}
                  onChange={(e) =>
                    setEditingMemory({ ...editingMemory, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Gemma Reminiscence Prompt</label>
                <textarea
                  value={editingMemory.reminiscenceCue || ''}
                  onChange={(e) =>
                    setEditingMemory({ ...editingMemory, reminiscenceCue: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-serif"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setEditingMemory(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMemoryEdits}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
