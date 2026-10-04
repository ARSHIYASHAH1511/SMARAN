/**
 * Smaran AI - Background Medication & Daily Activity Reminder Engine
 * Supports 8:00 AM Daily Morning Sanctuary Alarm, 90-minute reminder intervals,
 * Web Worker background timing, Service Worker OS notifications, Web Audio calming chimes,
 * and multilingual voice alerts without requiring authentication.
 */

import { Language } from './translations';

export type ReminderCategory = 'medication' | 'palace' | 'hydration' | 'activity' | 'prayer';

export interface Reminder {
  id: string;
  title: string;
  category: ReminderCategory;
  intervalType: 'interval' | 'specific_time';
  intervalMinutes: number;
  scheduledTime?: string; // e.g. '08:00'
  enabled: boolean;
  voiceAlert: boolean;
  voiceText?: string;
  notes?: string;
  icon?: string;
  targetTab?: 'home' | 'palace' | 'album' | 'therapist' | 'motif_match' | 'sequence_memory';
  lastTriggered?: number;
  nextTriggerTime: number;
  createdAt?: number;
}

export interface ReminderLog {
  id: string;
  reminderId: string;
  title: string;
  category: ReminderCategory;
  triggeredAt: number;
  status: 'triggered' | 'completed' | 'snoozed';
  completedAt?: number;
}

const LOCAL_STORAGE_KEY = 'Smaran_reminders_cache';
const LOCAL_LOGS_KEY = 'Smaran_reminder_logs';

/**
 * Calculates the timestamp of the very next 8:00 AM.
 * If current time is before 8:00 AM today, returns 8:00 AM today.
 * If 8:00 AM has already passed today, returns 8:00 AM tomorrow.
 */
export function calculateNext8AMTime(): number {
  const now = new Date();
  const target = new Date();
  target.setHours(8, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

export const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'rem-daily-8am-open',
    title: '8:00 AM Daily Morning Sanctuary Alarm',
    category: 'activity',
    intervalType: 'specific_time',
    intervalMinutes: 1440,
    scheduledTime: '08:00',
    enabled: true,
    voiceAlert: true,
    voiceText: 'Good morning! It is 8:00 AM. Time to open SMARAN, review your morning rituals, and start a peaceful day.',
    notes: 'Daily 8:00 AM morning alarm to open SMARAN, take morning medicine, and check your 3D Memory Palace.',
    icon: '⏰',
    targetTab: 'home',
    nextTriggerTime: calculateNext8AMTime(),
  },
  {
    id: 'rem-med-morning',
    title: 'Morning BP & Diabetes Tablets',
    category: 'medication',
    intervalType: 'interval',
    intervalMinutes: 90,
    enabled: true,
    voiceAlert: true,
    voiceText: 'Grandmother, please take your morning BP and diabetes medicine with warm water and Tulsi tea.',
    notes: 'Green medicine box on the corner table next to the ginger tea thermos.',
    icon: '💊',
    targetTab: 'home',
    nextTriggerTime: Date.now() + 90 * 60 * 1000,
  },
  {
    id: 'rem-palace-check',
    title: 'Check the 3D Memory Palace',
    category: 'palace',
    intervalType: 'interval',
    intervalMinutes: 90,
    enabled: true,
    voiceAlert: true,
    voiceText: 'Please check your Memory Palace to review your brass keys on the Gamosa and daily essentials.',
    notes: 'Confirm the house keys on the red-bordered Gamosa and medicine locations in the 3D room.',
    icon: '🗝️',
    targetTab: 'palace',
    nextTriggerTime: Date.now() + 90 * 60 * 1000,
  },
  {
    id: 'rem-tea-hydration',
    title: 'Warm Ginger Tea & Hydration',
    category: 'hydration',
    intervalType: 'interval',
    intervalMinutes: 90,
    enabled: true,
    voiceAlert: true,
    voiceText: 'Time for a sip of warm water or comforting Upper Assam ginger tea to stay hydrated.',
    notes: 'Drink a glass of warm water or ginger-infused CTC tea.',
    icon: '☕',
    targetTab: 'home',
    nextTriggerTime: Date.now() + 90 * 60 * 1000,
  },
  {
    id: 'rem-cognitive-game',
    title: 'Cognitive Brain Stimulation Game',
    category: 'activity',
    intervalType: 'interval',
    intervalMinutes: 90,
    enabled: true,
    voiceAlert: true,
    voiceText: 'Time for a brief and joyful cultural motif game to keep your memory sharp and energized.',
    notes: 'Play Motif Match or flip through family memories.',
    icon: '🦏',
    targetTab: 'motif_match',
    nextTriggerTime: Date.now() + 90 * 60 * 1000,
  },
  {
    id: 'rem-prayer-bell',
    title: 'Puja Room Prayer & Brass Bell',
    category: 'prayer',
    intervalType: 'specific_time',
    intervalMinutes: 1440,
    scheduledTime: '18:30',
    enabled: true,
    voiceAlert: true,
    voiceText: 'Evening prayer time. Ring the sacred brass bell in the puja room and feel calm.',
    notes: 'Light evening diya and ring the prayer bell.',
    icon: '🔔',
    targetTab: 'palace',
    nextTriggerTime: Date.now() + 90 * 60 * 1000,
  },
];

export const LOCALIZED_REMINDER_CONTENT: Record<
  string,
  Record<Language, { title: string; voiceText: string; notes: string }>
> = {
  'rem-daily-8am-open': {
    en: {
      title: '8:00 AM Morning Sanctuary Alarm',
      voiceText: 'Good morning! It is 8:00 AM. Time to open SMARAN, review your morning rituals, and start a peaceful day.',
      notes: 'Daily 8:00 AM morning alarm to open SMARAN, take morning medicine, and check your 3D Memory Palace.',
    },
    as: {
      title: 'ৰাতিপুৱা ৮ বজাৰ দৈনিক এলৰ্ম',
      voiceText: 'শুভ ৰাতিপুৱা! এতিয়া ৰাতিপুৱা ৮ বাজিছে। স্মৰণ (SMARAN) এপ্লিকেচন খুলি আপোনাৰ দিনটো শান্তভাৱে আৰম্ভ কৰক।',
      notes: 'স্মৰণ (SMARAN) খুলিবলৈ আৰু ৰাতিপুৱাৰ ঔষধ খাবলৈ ৮ বজাৰ এলৰ্ম।',
    },
    brx: {
      title: 'फुंनि ८ बाजियाव सानफ्रोमनि एलार्म',
      voiceText: 'फुंनि ८ बाजिबाय। स्मरण (SMARAN) खौ खेवनानै सानखौ गोजोनै जागाय।',
      notes: 'स्मरण (SMARAN) खौ खेवनो फुंनि ८ बाजियाव सोंनाय।',
    },
    mni: {
      title: 'অয়ুক্কী পুং ৮ গী নোংমগী এলৰ্ম',
      voiceText: 'অয়ুক্কী পুং ৮ তারে। স্মৰণ (SMARAN) হাংদোকউ অমসুং নুমিৎতু নিংথিনা হৌগৎলু।',
      notes: 'স্মৰণ (SMARAN) হাংদোক্নবা অয়ুক্কী পুং ৮ গী নিংশিংবা।',
    },
    hi: {
      title: 'सुबह 8 बजे का दैनिक अलार्म',
      voiceText: 'शुभ प्रभात! सुबह के 8 बज चुके हैं। स्मरण (SMARAN) खोलें, अपनी दवा लें और शांत दिन की शुरुआत करें।',
      notes: 'स्मरण (SMARAN) खोलने और सुबह की देखभाल के लिए प्रतिदिन सुबह 8 बजे का अलार्म।',
    },
  },
  'rem-med-morning': {
    en: {
      title: 'Morning BP & Diabetes Tablets',
      voiceText: 'Grandmother, please take your morning BP and diabetes medicine with warm water and Tulsi tea.',
      notes: 'Green medicine box on the corner table next to the ginger tea thermos.',
    },
    as: {
      title: 'ৰাতিপুৱাৰ বিপি আৰু চুগাৰৰ টেবলেট',
      voiceText: 'আইতা, অনুগ্ৰহ কৰি কুহুমীয়া পানী আৰু তুলসী চাহৰ সৈতে ৰাতিপুৱাৰ ঔষধখিনি খাওক।',
      notes: 'চাহৰ ফ্লাস্কৰ কাষত সেউজীয়া বাকচটোত ঔষধ আছে।',
    },
    brx: {
      title: 'फुंनि मुलि लोंनाय',
      voiceText: 'आबै, अननानै फुंनि मुलिखौ दुंफुं दै आरो तुलसि साहाजों लों।',
      notes: 'साहा फ्लास्कनि सेराव गोथां मुलि बाकसु दं।',
    },
    mni: {
      title: 'অয়ুক্কী হিদাক চাবগী মতম',
      voiceText: 'ইবুংঙো, ঈশিং অশাবা অমসুং তুলসী চাগা লোয়ননা অয়ুক্কী হিদাক চাবীয়ু।',
      notes: 'চাগী থাৰ্মাস নাকলদা লৈবা গ্রীন বক্সতা হিদাক লৈ।',
    },
    hi: {
      title: 'सुबह की बीपी व शुगर की दवा',
      voiceText: 'दादीजी, कृपया गुनगुने पानी और तुलसी चाय के साथ अपनी सुबह की दवा ले लें।',
      notes: 'अदरक चाय की केतली के पास रखे हरे डिब्बे में दवा है।',
    },
  },
  'rem-palace-check': {
    en: {
      title: 'Check the 3D Memory Palace',
      voiceText: 'Please check your Memory Palace to review your brass keys on the Gamosa and daily essentials.',
      notes: 'Confirm the house keys on the red-bordered Gamosa and medicine locations in the 3D room.',
    },
    as: {
      title: 'স্মৃতি মহল নিৰীক্ষণ কৰক',
      voiceText: 'অনুগ্ৰহ কৰি আপোনাৰ স্মৃতি মহলত গামোচাত থকা পিতলৰ চাবি আৰু ঔষধৰ স্থান পৰীক্ষা কৰক।',
      notes: '৩D কোঠাত ফুল থকা গামোচাৰ ওপৰত চাবি সুৰক্ষিত আছে।',
    },
    brx: {
      title: 'गोसोखां न\' नायफिन',
      voiceText: 'अननानै गोसोखां न\'आव थांनानै आरोनाय सायाव थानाय साबि आरो मुलिखौ नाय।',
      notes: '३D खथायाव साबि आरो मुलि मोजाङै लाखिनाय दं।',
    },
    mni: {
      title: 'নিংশিং কোল য়েংশিনবা',
      voiceText: 'চানবীদুনা নিংশিং কোলদা থম্বা চাবি অমসুং হিদাকশিংগী মফম য়েংবীয়ু।',
      notes: '৩D কাদগী গামোচাদা চাবি অমসুং হিদাকশিং ময়েক শেংনা লৈ।',
    },
    hi: {
      title: '3D स्मृति महल देखें',
      voiceText: 'कृपया अपने स्मृति महल में जाकर गमोसा पर रखी पीतल की चाबियां और आवश्यक वस्तुएं देखें।',
      notes: 'कमरे में लाल किनारी वाले गमोसा पर रखी चाबियां सुरक्षित हैं।',
    },
  },
  'rem-tea-hydration': {
    en: {
      title: 'Warm Ginger Tea & Hydration',
      voiceText: 'Time for a sip of warm water or comforting Upper Assam ginger tea to stay hydrated.',
      notes: 'Drink a glass of warm water or ginger-infused CTC tea.',
    },
    as: {
      title: 'কুহুমীয়া পানী আৰু আদা চাহ',
      voiceText: 'পিয়াহ গুচাবলৈ এগিলাচ কুহুমীয়া পানী অথবা উজনি অসমৰ সোৱাদভৰা আদা চাহ খাওক।',
      notes: 'কুহুমীয়া পানী বা আদা চাহ খাই শৰীৰ সুস্থ ৰাখক।',
    },
    brx: {
      title: 'दुंफुं दै आरो हादुं साहा',
      voiceText: 'गोसो मोजां थानो थाखाय दुंफुं दै एबा सा-सानजानि साहा लों।',
      notes: 'दुंफुं दैजों साहा लोंनानै गोसोखौ गोजोन लाखि।',
    },
    mni: {
      title: 'ঈশিং অশাবা অমসুং আদা চা',
      voiceText: 'হকশেলগীদমক ঈশিং অশাবা নত্রগা আদা চা তেক্লগা থকপীয়ু।',
      notes: 'ঈশিং অশাবা থক্তুনা হকচাংবু মপাঙ্গল কনহনবীয়ু।',
    },
    hi: {
      title: 'गुनगुना पानी और अदरक वाली चाय',
      voiceText: 'शरीर को ऊर्जावान रखने के लिए थोड़ा गुनगुना पानी या ताज़ा असम अदरक की चाय पिएं।',
      notes: 'एक गिलास गुनगुना पानी या अदरक वाली चाय लें।',
    },
  },
  'rem-cognitive-game': {
    en: {
      title: 'Cognitive Brain Stimulation Game',
      voiceText: 'Time for a brief and joyful cultural motif game to keep your memory sharp and energized.',
      notes: 'Play Motif Match or flip through family memories.',
    },
    as: {
      title: 'সাংস্কৃতিক স্মৃতি খেল',
      voiceText: 'মন সতেজ আৰু তীক্ষ্ণ ৰাখিবলৈ এটি সহজ সাংস্কৃতিক মোটিফ খেল খেলক।',
      notes: 'মোটিফ মেচ খেল অথবা পুৰণি ফটো এলবাম চাওক।',
    },
    brx: {
      title: 'गोसो सोंनाय हारिमुनि गेलेनाय',
      voiceText: 'गोसोखौ साख्रिथाव लाखिनो मोतिफ गेलेनायखौ गेले।',
      notes: 'मोतिफ गेलेनानै गोसोखांथि मोजां खालाम।',
    },
    mni: {
      title: 'ৱাখলগী খুদম তান্নবা শান্নপোৎ',
      voiceText: 'ৱাখলবু থৱায় পানহন্নবা অৱাং-নোংপোক্কী মোটিফ শান্নপোৎ শান্নবীয়ু।',
      notes: 'মোতিফ মেচ শান্নদুনা নিংশিংবগী মপাঙ্গল কনহনবীয়ু।',
    },
    hi: {
      title: 'संज्ञानात्मक मन का खेल',
      voiceText: 'अपनी याददाश्त को सक्रिय और आनंदित रखने के लिए सांस्कृतिक प्रतीक मिलान खेलें।',
      notes: 'मोतिफ मैच खेलें या पारिवारिक तस्वीरें देखें।',
    },
  },
  'rem-prayer-bell': {
    en: {
      title: 'Puja Room Prayer & Brass Bell',
      voiceText: 'Evening prayer time. Ring the sacred brass bell in the puja room and feel calm.',
      notes: 'Light evening diya and ring the prayer bell.',
    },
    as: {
      title: 'সন্ধিয়াৰ প্ৰাৰ্থনা আৰু পিতলৰ ঘণ্টা',
      voiceText: 'সন্ধিয়াৰ প্ৰাৰ্থনাৰ সময় হ’ল। পূজা কোঠাৰ পিতলৰ ঘণ্টা বজাই মন শান্ত কৰক।',
      notes: 'সন্ধিয়া চাকি জ্বলাই ঘণ্টা বজাওক।',
    },
    brx: {
      title: 'बेलासिनि आरज आरो घन्टा',
      voiceText: 'बेलासिनि आरजनि सम जाबाय। फुजा खथानि घन्टाखौ दामनानै गोसोखौ गोजोन खालाम।',
      notes: 'बेलासियाव बाथि साखांनानै घन्टा दाम।',
    },
    mni: {
      title: 'নুমিদাংগী লাইনীং অমসুং খোঙলৌ',
      voiceText: 'নুমিদাংগী লাইনীং থৌরমগী মতম ওইরে। পিত্ৰাইগী খোঙলৌ তাখোল্লগা শান্ত তৌবীয়ু।',
      notes: 'নুমিদাংগী থাউমৈ থান্থোক্লগা লাই খুরুম্বীয়ু।',
    },
    hi: {
      title: 'शाम की पूजा और पीतल की घंटी',
      voiceText: 'शाम की पूजा का समय हो गया है। पूजा कक्ष की पवित्र पीतल की घंटी बजाएं और शांति महसूस करें।',
      notes: 'संध्या का दीपक जलाएं और घंटी बजाएं।',
    },
  },
};

export function getLocalizedReminderContent(
  reminder: Reminder,
  lang: Language = 'en'
): { title: string; voiceText: string; notes?: string } {
  const custom = LOCALIZED_REMINDER_CONTENT[reminder.id]?.[lang];
  if (custom) {
    return {
      title: custom.title,
      voiceText: custom.voiceText,
      notes: custom.notes,
    };
  }
  return {
    title: reminder.title,
    voiceText: reminder.voiceText || `${reminder.title}. ${reminder.notes || ''}`,
    notes: reminder.notes,
  };
}

let sharedAudioContext: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextClass();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

export function unlockAudio() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getSharedAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  } catch {
    // safe fallback
  }
}

if (typeof window !== 'undefined') {
  ['click', 'touchstart', 'touchend', 'keydown', 'pointerdown'].forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { passive: true });
  });
}

let cachedVoices: SpeechSynthesisVoice[] = [];
function getVoicesList(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  } catch {
    // safe fallback
  }
}

export function playSyntheticBeepFallback() {
  try {
    if (typeof window === 'undefined') return;
    const sampleRate = 8000;
    const duration = 0.8;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new Uint8Array(44 + numSamples);

    buffer.set([0x52, 0x49, 0x46, 0x46], 0);
    const fileLength = 36 + numSamples;
    buffer[4] = fileLength & 0xff;
    buffer[5] = (fileLength >> 8) & 0xff;
    buffer[6] = (fileLength >> 16) & 0xff;
    buffer[7] = (fileLength >> 24) & 0xff;
    buffer.set([0x57, 0x41, 0x56, 0x45], 8);
    buffer.set([0x66, 0x6d, 0x74, 0x20], 12);
    buffer.set([16, 0, 0, 0], 16);
    buffer.set([1, 0], 20);
    buffer.set([1, 0], 22);
    buffer[24] = sampleRate & 0xff;
    buffer[25] = (sampleRate >> 8) & 0xff;
    buffer[26] = (sampleRate >> 16) & 0xff;
    buffer[27] = (sampleRate >> 24) & 0xff;
    buffer[28] = sampleRate & 0xff;
    buffer[29] = (sampleRate >> 8) & 0xff;
    buffer[30] = (sampleRate >> 16) & 0xff;
    buffer[31] = (sampleRate >> 24) & 0xff;
    buffer.set([1, 0], 32);
    buffer.set([8, 0], 34);
    buffer.set([0x64, 0x61, 0x74, 0x61], 36);
    buffer[40] = numSamples & 0xff;
    buffer[41] = (numSamples >> 8) & 0xff;
    buffer[42] = (numSamples >> 16) & 0xff;
    buffer[43] = (numSamples >> 24) & 0xff;

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-4.2 * t);
      const val = Math.sin(2 * Math.PI * 587.33 * t) * 0.7 + Math.sin(2 * Math.PI * 880.0 * t) * 0.3;
      buffer[44 + i] = Math.floor(128 + 115 * env * val);
    }

    let binary = '';
    for (let i = 0; i < buffer.byteLength; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    const base64 = btoa(binary);
    const audio = new Audio(`data:audio/wav;base64,${base64}`);
    audio.volume = 1.0;
    audio.play().catch(() => {});
  } catch {
    // safe fallback
  }
}

/**
 * Resonant, calming morning sunrise alarm chime
 */
export function playMorningAlarmSound() {
  unlockAudio();
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) {
      playSyntheticBeepFallback();
      return;
    }
    const now = ctx.currentTime;
    // 5-tone uplifting morning chord: C5 -> E5 -> G5 -> B5 -> C6
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);
      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.4, now + idx * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 1.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 1.5);
    });
  } catch (e) {
    console.warn('[ReminderEngine] playMorningAlarmSound notice:', e);
    playSyntheticBeepFallback();
  }
}

export function playChimeSound() {
  unlockAudio();
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) {
      playSyntheticBeepFallback();
      return;
    }

    const scheduleNotes = () => {
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.14);
          gain.gain.setValueAtTime(0, now + idx * 0.14);
          gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.14 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.14);
          osc.stop(now + idx * 0.14 + 1.25);
        });
      } catch (e) {
        console.warn('[ReminderEngine] scheduleNotes fallback:', e);
        playSyntheticBeepFallback();
      }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        scheduleNotes();
      }).catch(() => {
        playSyntheticBeepFallback();
      });
    } else {
      scheduleNotes();
    }
  } catch (e) {
    console.warn('[ReminderEngine] Web Audio chime notice:', e);
    playSyntheticBeepFallback();
  }
}

export function speakReminderText(text: string, language: string = 'en') {
  playChimeSound();
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      try {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(text);
        (window as any).__SmaranUtterance = utterance;
        utterance.rate = 0.86;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = getVoicesList();
        let selectedVoice: SpeechSynthesisVoice | undefined;

        if (language === 'hi') {
          selectedVoice =
            voices.find((v) => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hin')) ||
            voices.find((v) => v.lang.toLowerCase().includes('in'));
          utterance.lang = selectedVoice ? selectedVoice.lang : 'hi-IN';
        } else if (language === 'as') {
          selectedVoice =
            voices.find((v) => v.lang.toLowerCase().startsWith('as')) ||
            voices.find((v) => v.lang.toLowerCase().startsWith('bn') || v.lang.toLowerCase().includes('ben')) ||
            voices.find((v) => v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hi_in')) ||
            voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in'));
          utterance.lang = selectedVoice ? selectedVoice.lang : 'bn-IN';
        } else if (language === 'brx') {
          selectedVoice =
            voices.find((v) => v.lang.toLowerCase().startsWith('brx')) ||
            voices.find((v) => v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hi_in')) ||
            voices.find((v) => v.lang.toLowerCase().startsWith('hi')) ||
            voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in'));
          utterance.lang = selectedVoice ? selectedVoice.lang : 'hi-IN';
        } else if (language === 'mni') {
          selectedVoice =
            voices.find((v) => v.lang.toLowerCase().startsWith('mni')) ||
            voices.find((v) => v.lang.toLowerCase().startsWith('bn') || v.lang.toLowerCase().includes('ben')) ||
            voices.find((v) => v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hi_in')) ||
            voices.find((v) => v.lang.toLowerCase().includes('en-in'));
          utterance.lang = selectedVoice ? selectedVoice.lang : 'hi-IN';
        } else {
          selectedVoice =
            voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) ||
            voices.find((v) => v.lang.toLowerCase().includes('en-us') || v.lang.toLowerCase().startsWith('en'));
          utterance.lang = selectedVoice ? selectedVoice.lang : 'en-IN';
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
          (window as any).__SmaranUtterance = null;
        };

        utterance.onerror = (e) => {
          console.warn('[ReminderEngine] TTS error:', e);
          (window as any).__SmaranUtterance = null;
          playSyntheticBeepFallback();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[ReminderEngine] Utterance error:', err);
        playSyntheticBeepFallback();
      }
    }, 70);
  } catch (e) {
    console.warn('[ReminderEngine] Speech synthesis error:', e);
    playSyntheticBeepFallback();
  }
}

class ReminderEngine {
  private reminders: Reminder[] = [];
  private swRegistration: ServiceWorkerRegistration | null = null;
  private worker: Worker | null = null;
  private listeners: Set<(reminders: Reminder[]) => void> = new Set();
  private alertListeners: Set<(reminder: Reminder) => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.loadFromCache();
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    await this.initServiceWorker();
    this.startBackgroundWorker();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.checkPendingTriggers();
        }
      });
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_CLICKED') {
          const { reminderId } = event.data;
          if (reminderId) {
            const found = this.reminders.find((r) => r.id === reminderId);
            if (found) {
              this.notifyAlertSubscribers(found);
            }
          }
        }
      });
    }
  }

  private loadFromCache() {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if 8 AM alarm is in the list; if missing, prepend it
          const has8AM = parsed.some((r: Reminder) => r.id === 'rem-daily-8am-open');
          let list = parsed;
          if (!has8AM) {
            const eightAM = DEFAULT_REMINDERS.find((r) => r.id === 'rem-daily-8am-open');
            if (eightAM) list = [eightAM, ...parsed];
          }

          this.reminders = list.map((r: Reminder) => {
            let interval = r.intervalMinutes || 90;
            let nextTrigger = r.nextTriggerTime;
            if (r.id === 'rem-daily-8am-open' || (r.intervalType === 'specific_time' && r.scheduledTime === '08:00')) {
              if (!nextTrigger || nextTrigger < Date.now()) {
                nextTrigger = calculateNext8AMTime();
              }
            } else if (!nextTrigger) {
              nextTrigger = Date.now() + interval * 60 * 1000;
            }
            return {
              ...r,
              intervalMinutes: interval,
              nextTriggerTime: nextTrigger,
            };
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load cached reminders', e);
    }
    this.reminders = [...DEFAULT_REMINDERS];
  }

  private saveToCache() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.reminders));
    } catch (e) {
      console.warn('Failed to save reminders to cache', e);
    }
    this.notifySubscribers();
  }

  private async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        this.swRegistration = reg;
        console.log('[ReminderEngine] ServiceWorker registered');
      } catch (err) {
        console.warn('[ReminderEngine] ServiceWorker registration notice:', err);
      }
    }
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch (e) {
      console.warn('Error requesting notification permission', e);
      return 'denied';
    }
  }

  public getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  private startBackgroundWorker() {
    if (typeof window === 'undefined') return;
    try {
      const workerCode = `
        setInterval(function() {
          postMessage('tick');
        }, 15000);
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);
      this.worker.onmessage = () => {
        this.checkPendingTriggers();
      };
    } catch (e) {
      console.warn('[ReminderEngine] Web Worker fallback to window.setInterval', e);
      setInterval(() => this.checkPendingTriggers(), 15000);
    }
  }

  public checkPendingTriggers() {
    const now = Date.now();
    let hasUpdates = false;

    for (let i = 0; i < this.reminders.length; i++) {
      const rem = this.reminders[i];
      if (!rem.enabled) continue;

      if (now >= rem.nextTriggerTime) {
        this.triggerReminder(rem);

        let nextTime: number;
        if (rem.id === 'rem-daily-8am-open' || (rem.intervalType === 'specific_time' && rem.scheduledTime === '08:00')) {
          // Next trigger is 8:00 AM tomorrow
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 1);
          nextDate.setHours(8, 0, 0, 0);
          nextTime = nextDate.getTime();
        } else if (rem.intervalType === 'specific_time' && rem.scheduledTime) {
          const [h, m] = rem.scheduledTime.split(':').map(Number);
          const nextDate = new Date();
          nextDate.setHours(h, m, 0, 0);
          nextDate.setDate(nextDate.getDate() + 1);
          nextTime = nextDate.getTime();
        } else {
          const intervalMs = (rem.intervalMinutes || 90) * 60 * 1000;
          nextTime = now + intervalMs;
        }

        this.reminders[i] = {
          ...rem,
          lastTriggered: now,
          nextTriggerTime: nextTime,
        };
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      this.saveToCache();
    }
  }

  public async triggerReminder(rem: Reminder, isTest: boolean = false) {
    console.log(`[ReminderEngine] Triggering alert: "${rem.title}"`);
    
    if (rem.id === 'rem-daily-8am-open' || rem.scheduledTime === '08:00') {
      playMorningAlarmSound();
    } else {
      playChimeSound();
    }

    const userLang = ((typeof window !== 'undefined' && localStorage.getItem('Smaran_lang')) || 'en') as Language;
    const localized = getLocalizedReminderContent(rem, userLang);

    if (rem.voiceAlert) {
      speakReminderText(localized.voiceText, userLang);
    }

    await this.showOsNotification(rem, localized.title, localized.notes || localized.voiceText);
    await this.logReminderTriggered(rem, isTest);
    this.notifyAlertSubscribers(rem);
  }

  private async showOsNotification(rem: Reminder, localizedTitle?: string, localizedBody?: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const title = localizedTitle || `SMARAN: ${rem.title}`;
    const body = localizedBody || rem.notes || rem.voiceText || 'Gentle reminder to open SMARAN.';
    const is8AM = rem.id === 'rem-daily-8am-open' || rem.scheduledTime === '08:00';

    const options: any = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `Smaran-rem-${rem.id}`,
      requireInteraction: true,
      data: {
        reminderId: rem.id,
        category: rem.category,
        targetTab: is8AM ? 'home' : (rem.targetTab || 'home'),
      },
      actions: [
        {
          action: 'open_app',
          title: is8AM ? '⏰ Open Smaran AI' : 'View Alert',
        },
        {
          action: 'mark_done',
          title: 'Mark Done',
        },
      ],
    };

    try {
      if (this.swRegistration && 'showNotification' in this.swRegistration) {
        await this.swRegistration.showNotification(title, options);
      } else if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          options,
        });
      } else {
        new Notification(title, options);
      }
    } catch {
      try {
        new Notification(title, { body });
      } catch {
        // ignore
      }
    }
  }

  private async logReminderTriggered(rem: Reminder, _isTest: boolean) {
    const logItem: ReminderLog = {
      id: `${rem.id}-${Date.now()}`,
      reminderId: rem.id,
      title: rem.title,
      category: rem.category,
      triggeredAt: Date.now(),
      status: 'triggered',
    };

    try {
      const existingLogs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY) || '[]');
      existingLogs.unshift(logItem);
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(existingLogs.slice(0, 50)));
    } catch (e) {
      console.warn('Log cache notice', e);
    }
  }

  public async markReminderCompleted(reminderId: string) {
    const now = Date.now();

    try {
      const existingLogs: ReminderLog[] = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY) || '[]');
      const found = existingLogs.find((l) => l.reminderId === reminderId && l.status === 'triggered');
      if (found) {
        found.status = 'completed';
        found.completedAt = now;
        localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(existingLogs));
      }
    } catch (e) {
      console.warn('Error updating log status', e);
    }

    const idx = this.reminders.findIndex((r) => r.id === reminderId);
    if (idx !== -1) {
      const rem = this.reminders[idx];
      let nextTime: number;
      if (rem.id === 'rem-daily-8am-open' || (rem.intervalType === 'specific_time' && rem.scheduledTime === '08:00')) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(8, 0, 0, 0);
        nextTime = nextDate.getTime();
      } else if (rem.intervalType === 'specific_time' && rem.scheduledTime) {
        const [h, m] = rem.scheduledTime.split(':').map(Number);
        const nextDate = new Date();
        nextDate.setHours(h, m, 0, 0);
        nextDate.setDate(nextDate.getDate() + 1);
        nextTime = nextDate.getTime();
      } else {
        nextTime = now + (rem.intervalMinutes || 90) * 60 * 1000;
      }

      this.reminders[idx] = {
        ...rem,
        nextTriggerTime: nextTime,
      };
      this.saveToCache();
    }
  }

  public snoozeReminder(reminderId: string, snoozeMinutes: number = 15) {
    const idx = this.reminders.findIndex((r) => r.id === reminderId);
    if (idx !== -1) {
      this.reminders[idx] = {
        ...this.reminders[idx],
        nextTriggerTime: Date.now() + snoozeMinutes * 60 * 1000,
      };
      this.saveToCache();
    }
  }

  public async saveReminder(reminder: Reminder) {
    const idx = this.reminders.findIndex((r) => r.id === reminder.id);
    if (idx >= 0) {
      this.reminders[idx] = reminder;
    } else {
      this.reminders.push(reminder);
    }
    this.saveToCache();
  }

  public async deleteReminder(id: string) {
    this.reminders = this.reminders.filter((r) => r.id !== id);
    this.saveToCache();
  }

  public async toggleReminder(id: string, enabled: boolean) {
    const idx = this.reminders.findIndex((r) => r.id === id);
    if (idx >= 0) {
      const rem = this.reminders[idx];
      let nextTrigger: number;
      if (rem.id === 'rem-daily-8am-open' || (rem.intervalType === 'specific_time' && rem.scheduledTime === '08:00')) {
        nextTrigger = enabled ? calculateNext8AMTime() : rem.nextTriggerTime;
      } else {
        nextTrigger = enabled
          ? Date.now() + (rem.intervalMinutes || 90) * 60 * 1000
          : rem.nextTriggerTime;
      }

      this.reminders[idx] = {
        ...rem,
        enabled,
        nextTriggerTime: nextTrigger,
      };
      this.saveToCache();
    }
  }

  public getReminders(): Reminder[] {
    return [...this.reminders];
  }

  public subscribe(fn: (reminders: Reminder[]) => void): () => void {
    this.listeners.add(fn);
    fn(this.getReminders());
    return () => this.listeners.delete(fn);
  }

  public subscribeAlerts(fn: (reminder: Reminder) => void): () => void {
    this.alertListeners.add(fn);
    return () => this.alertListeners.delete(fn);
  }

  private notifySubscribers() {
    const list = this.getReminders();
    this.listeners.forEach((fn) => fn(list));
  }

  private notifyAlertSubscribers(reminder: Reminder) {
    this.alertListeners.forEach((fn) => fn(reminder));
  }
}

export const reminderEngine = new ReminderEngine();
