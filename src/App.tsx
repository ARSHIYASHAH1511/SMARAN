/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Home,
  Box,
  BookImage,
  HeartHandshake,
  PhoneCall,
  User,
  Settings,
  X,
  Phone,
  PhoneForwarded,
  Mic,
  Loader2,
  FileText,
  Download,
  Sparkles,
  Globe,
  HelpCircle,
  Activity,
  FileDown,
  CheckCircle2,
  BellRing,
  CalendarCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Dashboard from './components/Dashboard';
import DailyTasksView from './components/DailyTasksView';
import MemoryPalace from './components/MemoryPalace';
import PhotoAlbum from './components/PhotoAlbum';
import Therapist from './components/Therapist';
import MotifMatch from './components/games/MotifMatch';
import SequenceMemory from './components/games/SequenceMemory';
import CheckInModal from './components/CheckInModal';
import CognitiveTrendChart from './components/CognitiveTrendChart';
import TutorialModal from './components/TutorialModal';
import ReminderModal from './components/ReminderModal';
import ReminderManagerModal from './components/ReminderManagerModal';
import { Reminder, reminderEngine } from './lib/reminderEngine';
import { seedDatabase } from './lib/db';
import { getActivities } from './lib/activityStore';
import { Language } from './lib/translations';
import { useLanguage } from './contexts/LanguageContext';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'rituals' | 'palace' | 'album' | 'therapist' | 'motif_match' | 'sequence_memory'>('home');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState<{ name: string; age: string } | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  // Medication & Activity Reminder Alerts
  const [activeReminderAlert, setActiveReminderAlert] = useState<Reminder | null>(null);
  const [showReminderManager, setShowReminderManager] = useState(false);

  // Global Language context
  const { lang, setLanguage, t } = useLanguage();

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);

  // Offline simulation state
  const [isOffline, setIsOffline] = useState(false);

  // Voice AI Assistant State
  const [showVoiceAI, setShowVoiceAI] = useState(false);
  const [voicePrompt, setVoicePrompt] = useState('');
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceReply, setVoiceReply] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Report State
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');

  // SOS Simulation state
  const [sosActive, setSosActive] = useState(false);
  const [sosPhase, setSosPhase] = useState(0);

  const handleSelectLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };

  useEffect(() => {
    seedDatabase().catch(console.error);

    // Initialize background medication & daily activity reminder engine
    reminderEngine.init();

    // Subscribe to real-time reminder triggers
    const unsubAlerts = reminderEngine.subscribeAlerts((alertReminder) => {
      setActiveReminderAlert(alertReminder);
    });

    // Check URL query parameters (e.g. from service worker notification click: ?tab=palace)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const initialTab = urlParams.get('tab');
      if (
        initialTab &&
        ['home', 'rituals', 'palace', 'album', 'therapist', 'motif_match', 'sequence_memory'].includes(initialTab)
      ) {
        setActiveTab(initialTab as any);
      }
    } catch (e) {
      console.warn('URL params check error', e);
    }

    // Listen for service worker notification click events
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICKED') {
        if (event.data.targetTab) {
          setActiveTab(event.data.targetTab);
        }
        if (event.data.action === 'open_palace') {
          setActiveTab('palace');
        }
        if (event.data.data?.reminderId) {
          const found = reminderEngine.getReminders().find((r) => r.id === event.data.data.reminderId);
          if (found) {
            setActiveReminderAlert(found);
          }
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    const seenTutorial = localStorage.getItem('firefly_tutorial_seen');
    if (!seenTutorial) {
      setShowTutorial(true);
    }

    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = localStorage.getItem('smriti_last_checkin');
    if (lastCheckIn !== today) {
      setShowCheckIn(true);
    }

    const savedProfile = localStorage.getItem('firefly_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        setProfile({ name: 'Grandmother Ananya', age: '74' });
      }
    } else {
      setProfile({ name: 'Grandmother Ananya', age: '74' });
    }

    setActivities(getActivities());

    return () => {
      unsubAlerts();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, []);

  const handleSOS = () => {
    setSosActive(true);
    setSosPhase(1);
    setTimeout(() => setSosPhase(2), 2000);
    setTimeout(() => setSosPhase(3), 5000);
    setTimeout(() => setSosPhase(4), 8000);
  };

  const handleStartListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceReply("Sorry, your browser doesn't support voice recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    if (lang === 'hi') recognition.lang = 'hi-IN';
    else if (lang === 'as') recognition.lang = 'as-IN';
    else recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceReply('');
      setVoicePrompt('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoicePrompt(transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error !== 'aborted') {
        setVoiceReply("Sorry, I didn't catch that. Please tap the mic to try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleVoiceCommand = async (text: string) => {
    if (!text.trim()) return;
    setVoiceProcessing(true);
    setVoiceReply('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, persona: 'ai_assistant', language: lang }),
      });
      const data = await res.json();
      setVoiceReply(data.reply || 'Understood.');
      if (data.action === 'navigate' || data.action === 'open_game') {
        if (['home', 'palace', 'album', 'therapist', 'motif_match', 'sequence_memory'].includes(data.target)) {
          setTimeout(() => {
            setActiveTab(data.target as any);
            setShowVoiceAI(false);
            setVoicePrompt('');
            setVoiceReply('');
          }, 1500);
        }
      }
    } catch (e) {
      setVoiceReply("I'm sorry, I couldn't understand that right now.");
    } finally {
      setVoiceProcessing(false);
    }
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportContent('');
    try {
      const acts = getActivities();
      setActivities(acts);

      let conversations: any[] = [];
      try {
        const storedChats = localStorage.getItem('firefly_local_chats');
        if (storedChats) {
          const parsedChats = JSON.parse(storedChats);
          if (Array.isArray(parsedChats) && parsedChats.length > 0) {
            const firstChatMsgs = localStorage.getItem(`firefly_chat_msgs_${parsedChats[0].id}`);
            if (firstChatMsgs) {
              conversations = JSON.parse(firstChatMsgs);
            }
          }
        }
      } catch {
        // safe fallback
      }

      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: acts,
          conversations,
          patientName: profile?.name || 'Grandmother Ananya',
          patientAge: profile?.age || '74',
        }),
      });
      const data = await res.json();
      setReportContent(data.report || 'Failed to generate report.');
    } catch (e) {
      console.error(e);
      setReportContent('An error occurred while generating the report.');
    } finally {
      setReportLoading(false);
    }
  };

  const downloadReport = (format: 'md' | 'doc') => {
    if (!reportContent) return;
    const dateStr = new Date().toISOString().split('T')[0];
    let blob: Blob;
    let filename: string;
    if (format === 'doc') {
      const htmlContent = `<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <title>SMARAN Clinical Dementia Report</title> <style> body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 30px; } h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; } h2 { color: #0369a1; margin-top: 24px; } p, li { font-size: 14px; } .badge { background-color: #fef3c7; color: #78350f; padding: 4px 8px; border-radius: 4px; font-weight: bold; } </style> </head> <body> ${reportContent.replace(/# (.*)/g, '<h1>$1</h1>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/\n/g, '<br/>')} </body> </html>`;
      blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
      filename = `SMARAN_Clinical_Assessment_${dateStr}.doc`;
    } else {
      blob = new Blob([reportContent], { type: 'text/markdown' });
      filename = `SMARAN_Clinical_Assessment_${dateStr}.md`;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#faf8f5] text-stone-900 font-sans selection:bg-amber-100 relative">
      {/* Top Application Bar */}
      <header className="shrink-0 bg-white border-b border-stone-200/90 px-4 sm:px-6 py-2.5 z-30 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">🪔</span>
          <div className="min-w-0">
            <span className="font-extrabold text-stone-900 tracking-tight text-base sm:text-lg block truncate">
              SMARAN
            </span>
            <span className="text-[11px] text-stone-600 font-semibold hidden sm:block truncate">
              Remember. Relive. Reconnect.
            </span>
          </div>
        </div>

        {/* Global Controls: Voice, Settings & Language, Emergency SOS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowVoiceAI(true)}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            title={t.voiceAI?.title || 'Voice Assistant'}
          >
            <Mic className="w-4 h-4 text-stone-700" />
            <span className="hidden md:inline">{t.voiceAI?.title || 'Voice'}</span>
          </button>

          <button
            id="btn-header-settings"
            onClick={() => setShowSettings(true)}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            title={t.settings?.title || 'Settings'}
          >
            <Settings className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">{t.settings?.title || 'Settings'}</span>
            <span className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded font-mono font-bold text-stone-700">
              {lang.toUpperCase()}
            </span>
          </button>

          <button
            onClick={handleSOS}
            className="bg-rose-700 hover:bg-rose-800 text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Emergency SOS"
            aria-label="Emergency SOS"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </header>

      {/* Voice AI Assistant Modal */}
      {showVoiceAI && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white p-7 rounded-3xl w-full max-w-md shadow-xl relative border border-stone-200 flex flex-col items-center text-center">
            <button
              onClick={() => {
                setShowVoiceAI(false);
                setVoiceReply('');
                setVoicePrompt('');
              }}
              className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-all ${
                voiceProcessing ? 'bg-amber-100' : 'bg-amber-50'
              }`}
            >
              {voiceProcessing ? (
                <Loader2 className="w-10 h-10 text-amber-700 animate-spin" />
              ) : (
                <Mic className="w-10 h-10 text-amber-700" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-1">Voice Guide</h2>
            <p className="text-sm text-stone-600 mb-6 font-medium">
              Say: "Open Palace", "Check Reminders", or "Open Album"
            </p>
            {voiceReply ? (
              <div className="bg-stone-50 text-stone-900 p-4 rounded-2xl w-full text-base font-semibold border border-stone-200">
                "{voiceReply}"
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {voicePrompt && <p className="text-base text-stone-700 italic mb-4">"{voicePrompt}"</p>}
                <button
                  onClick={handleStartListening}
                  disabled={voiceProcessing || isListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-amber-600 shadow-md ring-4 ring-amber-200'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                  }`}
                >
                  <Mic className="w-10 h-10 text-white" />
                </button>
                <p className="mt-4 text-base text-stone-800 font-bold">
                  {isListening ? 'Listening... Please speak' : 'Tap the microphone to speak'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings / Caregiver Analytics Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative border-2 border-gray-100">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-5 right-5 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 border-b-2 border-gray-100 pb-5">
              <div className="bg-sky-100 p-4 rounded-full text-sky-700">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{profile?.name || 'Patient'}</h2>
                <div className="flex items-center gap-3 text-gray-600 font-medium mt-1">
                  <span>Age: {profile?.age || '72'}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Firefly NER Protocol
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Language Selection */}
              <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-stone-600" />
                    <span>Language & Regional Dialect</span>
                  </label>
                  <span className="text-xs bg-stone-100 text-stone-700 font-semibold px-2.5 py-1 rounded-full border border-stone-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Bhashini AI
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 mb-4 font-medium">
                  Optimized for elderly dementia care in Assam and the North Eastern Region of India.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'en', label: 'English', sub: 'Standard' },
                    { id: 'as', label: 'অসমীয়া', sub: 'Assamese' },
                    { id: 'brx', label: "बर' / Bodo", sub: 'Bodo' },
                    { id: 'mni', label: 'মৈতৈলোন্', sub: 'Manipuri' },
                    { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectLanguage(l.id as Language)}
                      className={`p-3 rounded-2xl text-center border transition-all ${
                        lang === l.id
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                          : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-sm sm:text-base font-semibold">{l.label}</div>
                      <div className={`text-[11px] font-medium ${lang === l.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {l.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Cognitive Trend Line using Recharts */}
              <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-700" />
                    <span>Weekly Cognitive Telemetry & Trends</span>
                  </h3>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 mb-4 font-medium">
                  Continuous performance tracking across Visual Motif Matching and Working Memory recall.
                </p>
                <CognitiveTrendChart activities={activities} />
              </div>

              {/* Caregiver Clinical Dementia Assessment Report */}
              <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-stone-700" />
                    <span>Clinical Dementia Assessment Report</span>
                  </label>
                  <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200">
                    Geriatric AI
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 mb-4 font-medium">
                  Generates an objective clinical evaluation of dementia stage, memory retention, semantic fluency, and safety recommendations for physicians and caregivers.
                </p>

                {reportContent ? (
                  <div className="space-y-4">
                    <div className="max-h-80 overflow-y-auto p-5 bg-white rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-800 prose prose-stone max-w-none">
                      <ReactMarkdown>{reportContent}</ReactMarkdown>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => downloadReport('doc')}
                        className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors"
                      >
                        <FileDown className="w-4 h-4" /> Download Medical Doc (.doc)
                      </button>
                      <button
                        onClick={() => downloadReport('md')}
                        className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download Markdown (.md)
                      </button>
                      <button
                        onClick={handleGenerateReport}
                        disabled={reportLoading}
                        className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs sm:text-sm border border-stone-200 transition-colors"
                      >
                        {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateReport}
                    disabled={reportLoading}
                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 disabled:bg-stone-400 flex items-center justify-center gap-2 shadow-2xs transition-colors"
                  >
                    {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    {reportLoading ? 'Analyzing Patient Telemetry...' : 'Generate Clinical Dementia Report'}
                  </button>
                )}
              </div>

              {/* Medication & Palace Reminder Settings */}
              <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BellRing className="w-5 h-5 text-stone-700" />
                    <h4 className="text-base font-bold text-stone-900">Medication & Activity Alerts</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
                    Configure repeating intervals for medicines, memory palace visits, and background chimes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowReminderManager(true);
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto transition-colors"
                >
                  <Settings className="w-4 h-4" /> Configure
                </button>
              </div>

              {/* Quick Onboarding Tour Trigger */}
              <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-stone-900">Website Walkthrough Tour</h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">Replay the simple step-by-step introduction to FireFly AI.</p>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowTutorial(true);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-stone-200 shrink-0 self-start sm:self-auto transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-stone-600" /> Start Tour
                </button>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 mt-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Simulation Modal */}
      {sosActive && (
        <div className="absolute inset-0 bg-rose-900/90 z-[100] flex flex-col items-center justify-center p-6 text-white text-center">
          <button
            onClick={() => setSosActive(false)}
            className="absolute top-6 right-6 p-4 bg-white/20 rounded-full hover:bg-white/30"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <Phone className="w-12 h-12" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">EMERGENCY SOS</h2>
          <div className="bg-black/30 p-6 rounded-3xl max-w-md w-full backdrop-blur-md border border-white/20">
            {sosPhase === 1 && <p className="text-xl font-bold animate-pulse">Initiating Emergency Protocol...</p>}
            {sosPhase === 2 && (
              <div className="space-y-4">
                <p className="text-xl font-bold text-amber-300">Calling Simultaneously:</p>
                <div className="flex items-center justify-center gap-3 text-lg bg-white/10 p-3 rounded-xl">
                  <Phone className="w-5 h-5 animate-pulse" /> <span>Family (+91 6361970462)</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-lg bg-white/10 p-3 rounded-xl">
                  <Phone className="w-5 h-5 animate-pulse" /> <span>Dr. Sharma (Primary Care)</span>
                </div>
                <p className="text-sm text-gray-300">Ringing...</p>
              </div>
            )}
            {sosPhase === 3 && (
              <div className="space-y-3">
                <p className="text-lg text-rose-200 font-bold">Calls Unanswered.</p>
                <div className="flex flex-col items-center gap-3">
                  <PhoneForwarded className="w-8 h-8 text-emerald-400" />
                  <p className="text-xl font-bold text-emerald-400">Recording Voice Message...</p>
                  <div className="bg-white/10 p-4 rounded-xl italic text-base border-l-4 border-emerald-500 text-left">
                    "Help, Your patient {profile?.name || 'number 001'} needs assistance in Assam. Location attached."
                  </div>
                </div>
              </div>
            )}
            {sosPhase === 4 && (
              <div className="space-y-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-emerald-400">Message Sent</p>
                <p className="text-base">Help is on the way. Please stay calm.</p>
                <button
                  onClick={() => setSosActive(false)}
                  className="mt-4 px-6 py-2.5 bg-white text-rose-900 font-bold text-base rounded-full"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tutorial Walkthrough Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => {
          setShowTutorial(false);
          localStorage.setItem('firefly_tutorial_seen', 'true');
        }}
        lang={lang}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setShowTutorial(false);
        }}
      />

      {/* Daily Check-In Modal */}
      {showCheckIn && <CheckInModal onComplete={() => setShowCheckIn(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-6">
        {activeTab === 'home' && (
          <Dashboard
            lang={lang}
            onOpenTutorial={() => setShowTutorial(true)}
            isOffline={isOffline}
            onToggleOffline={() => setIsOffline((prev) => !prev)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenReminderAlert={(rem) => setActiveReminderAlert(rem)}
          />
        )}
        {activeTab === 'rituals' && (
          <DailyTasksView
            lang={lang}
            onOpenReminderAlert={(rem) => setActiveReminderAlert(rem)}
            onOpenReminderManager={() => setShowReminderManager(true)}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}
        {activeTab === 'palace' && <MemoryPalace />}
        {activeTab === 'album' && <PhotoAlbum />}
        {activeTab === 'therapist' && <Therapist />}
        {activeTab === 'motif_match' && <MotifMatch onBack={() => setActiveTab('home')} />}
        {activeTab === 'sequence_memory' && <SequenceMemory onBack={() => setActiveTab('home')} />}
      </div>

      {/* Active Reminder Trigger Alert Modal */}
      {activeReminderAlert && (
        <ReminderModal
          reminder={activeReminderAlert}
          lang={lang}
          onClose={() => setActiveReminderAlert(null)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setActiveReminderAlert(null);
          }}
        />
      )}

      {/* Reminder Intervals & Background Manager Modal */}
      <ReminderManagerModal
        isOpen={showReminderManager}
        onClose={() => setShowReminderManager(false)}
        lang={lang}
        onTriggerTest={(testRem) => setActiveReminderAlert(testRem)}
      />

      {/* Persistent Bottom Navigation for Easy Access */}
      <nav className="shrink-0 bg-white border-t border-stone-200/90 shadow-2xs z-40 relative">
        <div className="max-w-4xl mx-auto flex items-center justify-around py-2.5 px-2 sm:px-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-2 px-3 sm:px-5 rounded-2xl transition-all ${
              activeTab === 'home'
                ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-medium'
            }`}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-xs sm:text-sm">{t.tabs.home}</span>
          </button>

          <button
            id="nav-tab-rituals"
            onClick={() => setActiveTab('rituals')}
            className={`flex flex-col items-center justify-center py-2 px-3 sm:px-5 rounded-2xl transition-all ${
              activeTab === 'rituals'
                ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-medium'
            }`}
          >
            <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-xs sm:text-sm">{t.tabs.rituals || 'Daily Care'}</span>
          </button>

          <button
            onClick={() => setActiveTab('palace')}
            className={`flex flex-col items-center justify-center py-2 px-3 sm:px-5 rounded-2xl transition-all ${
              activeTab === 'palace'
                ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-medium'
            }`}
          >
            <Box className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-xs sm:text-sm">{t.tabs.palace}</span>
          </button>

          <button
            onClick={() => setActiveTab('album')}
            className={`flex flex-col items-center justify-center py-2 px-3 sm:px-5 rounded-2xl transition-all ${
              activeTab === 'album'
                ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-medium'
            }`}
          >
            <BookImage className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-xs sm:text-sm">{t.tabs.album}</span>
          </button>

          <button
            onClick={() => setActiveTab('therapist')}
            className={`flex flex-col items-center justify-center py-2 px-3 sm:px-5 rounded-2xl transition-all ${
              activeTab === 'therapist'
                ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-medium'
            }`}
          >
            <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-xs sm:text-sm">{t.tabs.listen}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return <MainApp />;
}
