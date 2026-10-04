/**
 * Smaran AI - Daily Rituals Engine for Holistic Dementia Care
 * Tracks non-game daily physical, circadian, and sensory wellness rituals:
 * - Morning sunlight exposure (circadian rhythm entrainment & sundowning mitigation)
 * - Hydration & herbal tea (delirium & UTI prevention)
 * - Verandah walk / gentle movement (motor coordination & agitation relief)
 * - Regular warm meals (glycemic stability & routine predictability)
 * - Sensory nature touch / courtyard gardening (grounding & sensory reminiscence)
 * - Evening Sandhya calm & prayer (soothing twilight transition)
 * Supports offline-first LocalStorage persistence and Firebase Firestore cloud sync.
 */

import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { playChimeSound, speakReminderText } from './reminderEngine';
import { Language } from './translations';

export interface DailyRitualItem {
  id: string;
  key: 'sunlight' | 'water' | 'walk' | 'meals' | 'nature' | 'sandhya' | string;
  title: string;
  category: 'circadian' | 'hydration' | 'mobility' | 'nutrition' | 'sensory' | 'mindfulness' | 'custom';
  icon: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  clinicalBenefit: string;
  voicePrompt: {
    en: string;
    as: string;
    hi: string;
    brx?: string;
    mni?: string;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  subItems?: { id: string; label: string; completed: boolean }[];
  completedAt?: number;
}

export interface DailyRitualDay {
  dateKey: string; // YYYY-MM-DD
  rituals: DailyRitualItem[];
  overallPercentage: number;
  caregiverNote?: string;
  updatedAt: number;
}

const STORAGE_KEY_PREFIX = 'Smaran_daily_rituals_';

export const getTodayDateKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDefaultRituals = (): DailyRitualItem[] => [
  {
    id: 'rit-sunlight',
    key: 'sunlight',
    title: 'Morning Sunlight Exposure',
    category: 'circadian',
    icon: '☀️',
    targetValue: 15,
    currentValue: 0,
    unit: 'mins',
    completed: false,
    timeOfDay: 'morning',
    clinicalBenefit:
      'Natural morning sun sets the biological clock, boosts melatonin production for sound sleep, and significantly reduces evening sundowning restlessness.',
    voicePrompt: {
      en: 'Spending 15 minutes in the gentle morning sun helps your mind feel alert and prepares your body for peaceful sleep tonight.',
      as: 'ৰাতিপুৱাৰ কোমল ৰ’দত ১৫ মিনিট সময় কটালে টোপনি ভাল হয় আৰু মন সতেজ থাকে।',
      hi: 'सुबह की गुनगुनी धूप में 15 मिनट बिताने से रात में अच्छी नींद आती है और मन शांत रहता है।',
      brx: 'फुंनि सानश्रीयाव १५ मिनिट थायोब्ला गोसो मोजां जायो।',
      mni: 'অয়ুক্কী নুমিৎ পান্থোকপদা মিনিট ১৫ লৈবনা অদোমগী ৱাখলবু শান্ত ওইহনগনি।'
    }
  },
  {
    id: 'rit-water',
    key: 'water',
    title: 'Hydration & Ginger-Tulsi Tea',
    category: 'hydration',
    icon: '💧',
    targetValue: 6,
    currentValue: 0,
    unit: 'cups',
    completed: false,
    timeOfDay: 'anytime',
    clinicalBenefit:
      'Diminished thirst sensation in seniors makes dehydration a primary cause of acute confusion, delirium, and weakness. Keeping hydrated preserves mental clarity.',
    voicePrompt: {
      en: 'Please have a cup of warm water or ginger tulsi tea. Staying hydrated keeps your thoughts clear and body energized.',
      as: 'এগিলাচ কুহুমীয়া পানী বা আদা-তুলসী চাহ খাওক। পানীয়ে মগজু সতেজ ৰাখে।',
      hi: 'कृपया एक गिलास गुनगुना पानी या अदरक-तुलसी की चाय लें। पर्याप्त पानी पीने से मन और शरीर स्वस्थ रहता है।',
      brx: 'दुंफुं दै एबा साहा लोंनानै गोसोखौ मोजां लाखि।',
      mni: 'ঈশিং অশাবা নত্রগা চা থক্তুনা হকচাংবু মপাঙ্গল কনহনবীয়ু।'
    }
  },
  {
    id: 'rit-walk',
    key: 'walk',
    title: 'Verandah Walk & Gentle Stretch',
    category: 'mobility',
    icon: '🚶',
    targetValue: 10,
    currentValue: 0,
    unit: 'mins',
    completed: false,
    timeOfDay: 'morning',
    clinicalBenefit:
      'Gentle movement maintains joint flexibility, improves balance to prevent fall injuries, and relieves built-up motor tension or anxiety.',
    voicePrompt: {
      en: 'Take a slow, gentle walk along the courtyard or verandah. Breathe deeply and feel the fresh breeze.',
      as: 'বাৰাণ্ডাত অথবা চোতালত লাহে লাহে খোজ কাঢ়ক। মুকলি বতাহ উপভোগ কৰক।',
      hi: 'आंगन या बरामदे में धीरे-धीरे टहलें। ताज़ी हवा में गहरी सांस लें।',
      brx: 'नखरनि सेराव लासै लासै खारथिं।',
      mni: 'য়ুমগী নাকলদা কোমথোক্না খোঙচৎ চৎলু।'
    }
  },
  {
    id: 'rit-meals',
    key: 'meals',
    title: 'Nourishing Warm Meals',
    category: 'nutrition',
    icon: '🍲',
    targetValue: 3,
    currentValue: 0,
    unit: 'meals',
    completed: false,
    timeOfDay: 'anytime',
    clinicalBenefit:
      'Predictable mealtimes anchor daily structure and stabilize blood sugar levels, preventing sudden mood dips or confusion from skipped meals.',
    subItems: [
      { id: 'm-breakfast', label: 'Morning Breakfast (পুৱাৰ জলপান)', completed: false },
      { id: 'm-lunch', label: 'Afternoon Lunch (দুপৰীয়াৰ সাজ)', completed: false },
      { id: 'm-dinner', label: 'Light Evening Dinner (সন্ধিয়াৰ লঘু আহাৰ)', completed: false }
    ],
    voicePrompt: {
      en: 'Eating warm, nourishing meals on time keeps your body nourished and your day full of comforting rhythm.',
      as: 'সময়মতে গৰম পুষ্টিকৰ আহাৰ খালে শৰীৰত শক্তি থাকে আৰু মন স্থিৰ থাকে।',
      hi: 'समय पर पौष्टिक भोजन करने से शरीर स्वस्थ और ऊर्जावान बना रहता है।',
      brx: 'सम मते जामुं जा।',
      mni: 'মতম চানা চান-থকপনা হকচাংবু ফহনগনি।'
    }
  },
  {
    id: 'rit-nature',
    key: 'nature',
    title: 'Sensory Nature & Plant Touch',
    category: 'sensory',
    icon: '🌿',
    targetValue: 1,
    currentValue: 0,
    unit: 'visit',
    completed: false,
    timeOfDay: 'afternoon',
    clinicalBenefit:
      'Tactile contact with plants, feeling garden soil, or touching a sacred Tulsi sprig provides sensory grounding that eases anxiety and evokes warm childhood memories.',
    voicePrompt: {
      en: 'Touch a green leaf or the sacred Tulsi plant in the courtyard. Nature brings peaceful grounding to our senses.',
      as: 'চোতালৰ তুলসী গছজোপাত স্পৰ্শ কৰক। প্ৰকৃতিৰ পৰশে মনলৈ অপাৰ শান্তি আনে।',
      hi: 'आंगन में तुलसी या किसी हरे पौधे को छूकर महसूस करें। प्रकृति मन को गहरी शांति देती है।',
      brx: 'तुलसि बिलाइखौ दांनानै गोजोन मोन।',
      mni: 'তুলসী পানবীদা খুৎ থাদুনা শান্তি ফংবীয়ু।'
    }
  },
  {
    id: 'rit-sandhya',
    key: 'sandhya',
    title: 'Evening Sandhya Calm & Prayer',
    category: 'mindfulness',
    icon: '🪔',
    targetValue: 1,
    currentValue: 0,
    unit: 'prayer',
    completed: false,
    timeOfDay: 'evening',
    clinicalBenefit:
      'The twilight hour is vulnerable to sundowning anxiety. Lighting an evening diya, ringing the brass bell, or listening to calm chants creates a serene dusk sanctuary.',
    voicePrompt: {
      en: 'It is evening time. Light the brass lamp or listen quietly to prayer hymns to welcome a serene, peaceful night.',
      as: 'সন্ধিয়া নামঘৰৰ চাকি জ্বলাওক আৰু ঘণ্টাৰ ধ্বনি শুনি মন প্ৰশান্ত কৰক।',
      hi: 'संध्या काल है। पीतल का दीपक जलाएं और ईश्वर का ध्यान कर शांति का अनुभव करें।',
      brx: 'बेलासिनि बाथि सा।',
      mni: 'নুমিদাংগী থাউমৈ থান্থোক্লগা লাই খুরুম্বীয়ু।'
    }
  }
];

class DailyRitualsEngine {
  private subscribers: Array<(dayData: DailyRitualDay) => void> = [];
  private currentDayData: DailyRitualDay;

  constructor() {
    this.currentDayData = this.loadFromStorage(getTodayDateKey());
  }

  public init() {
    const today = getTodayDateKey();
    if (this.currentDayData.dateKey !== today) {
      this.currentDayData = this.loadFromStorage(today);
      this.notifySubscribers();
    }

    this.syncFromCloud(today).catch((err) => {
      console.warn('Initial cloud sync notice:', err);
    });
  }

  public subscribe(cb: (dayData: DailyRitualDay) => void): () => void {
    this.subscribers.push(cb);
    cb(this.currentDayData);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notifySubscribers() {
    for (const sub of this.subscribers) {
      try {
        sub(this.currentDayData);
      } catch (e) {
        console.error('Subscriber notify error:', e);
      }
    }
  }

  public getTodayData(): DailyRitualDay {
    return this.currentDayData;
  }

  private calculatePercentage(rituals: DailyRitualItem[]): number {
    if (rituals.length === 0) return 0;
    const completedCount = rituals.filter((r) => r.completed).length;
    return Math.round((completedCount / rituals.length) * 100);
  }

  private loadFromStorage(dateKey: string): DailyRitualDay {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + dateKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.rituals)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load daily rituals from localStorage:', e);
    }

    const defaultItems = getDefaultRituals();
    const newDay: DailyRitualDay = {
      dateKey,
      rituals: defaultItems,
      overallPercentage: 0,
      updatedAt: Date.now()
    };
    this.saveToStorage(newDay);
    return newDay;
  }

  private saveToStorage(dayData: DailyRitualDay) {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + dayData.dateKey, JSON.stringify(dayData));
    } catch (e) {
      console.warn('Failed to save daily rituals to localStorage:', e);
    }
  }

  public async toggleRitual(ritualId: string, customVal?: number): Promise<DailyRitualDay> {
    const rituals = this.currentDayData.rituals.map((item) => {
      if (item.id !== ritualId) return item;

      let newCompleted = !item.completed;
      let newCurrent = item.currentValue;

      if (customVal !== undefined) {
        newCurrent = Math.max(0, customVal);
        newCompleted = newCurrent >= item.targetValue;
      } else {
        if (newCompleted) {
          newCurrent = item.targetValue;
        } else {
          newCurrent = 0;
        }
      }

      let updatedSubItems = item.subItems;
      if (item.subItems) {
        if (customVal === undefined) {
          updatedSubItems = item.subItems.map((s) => ({ ...s, completed: newCompleted }));
        }
      }

      if (newCompleted) {
        playChimeSound();
      }

      return {
        ...item,
        completed: newCompleted,
        currentValue: newCurrent,
        subItems: updatedSubItems,
        completedAt: newCompleted ? Date.now() : undefined
      };
    });

    const percentage = this.calculatePercentage(rituals);
    const updatedDay: DailyRitualDay = {
      ...this.currentDayData,
      rituals,
      overallPercentage: percentage,
      updatedAt: Date.now()
    };

    this.currentDayData = updatedDay;
    this.saveToStorage(updatedDay);
    this.notifySubscribers();
    this.syncToCloud(updatedDay);
    return updatedDay;
  }

  public async incrementHydration(delta: number): Promise<DailyRitualDay> {
    const rituals = this.currentDayData.rituals.map((item) => {
      if (item.key !== 'water') return item;
      const nextVal = Math.max(0, Math.min(12, item.currentValue + delta));
      const completed = nextVal >= item.targetValue;
      if (delta > 0) {
        playChimeSound();
      }
      return {
        ...item,
        currentValue: nextVal,
        completed,
        completedAt: completed ? Date.now() : item.completedAt
      };
    });

    const percentage = this.calculatePercentage(rituals);
    const updatedDay: DailyRitualDay = {
      ...this.currentDayData,
      rituals,
      overallPercentage: percentage,
      updatedAt: Date.now()
    };

    this.currentDayData = updatedDay;
    this.saveToStorage(updatedDay);
    this.notifySubscribers();
    this.syncToCloud(updatedDay);
    return updatedDay;
  }

  public async toggleMealSubItem(mealSubId: string): Promise<DailyRitualDay> {
    const rituals = this.currentDayData.rituals.map((item) => {
      if (item.key !== 'meals' || !item.subItems) return item;
      const subItems = item.subItems.map((sub) =>
        sub.id === mealSubId ? { ...sub, completed: !sub.completed } : sub
      );
      const completedCount = subItems.filter((s) => s.completed).length;
      const completed = completedCount >= item.targetValue;
      if (!item.completed && completed) {
        playChimeSound();
      }
      return {
        ...item,
        subItems,
        currentValue: completedCount,
        completed,
        completedAt: completed ? Date.now() : item.completedAt
      };
    });

    const percentage = this.calculatePercentage(rituals);
    const updatedDay: DailyRitualDay = {
      ...this.currentDayData,
      rituals,
      overallPercentage: percentage,
      updatedAt: Date.now()
    };

    this.currentDayData = updatedDay;
    this.saveToStorage(updatedDay);
    this.notifySubscribers();
    this.syncToCloud(updatedDay);
    return updatedDay;
  }

  public async addCustomRitual(
    title: string,
    category: DailyRitualItem['category'],
    icon: string,
    targetValue = 1,
    unit = 'times',
    clinicalBenefit = 'Custom daily wellness routine for elder comfort.'
  ): Promise<DailyRitualDay> {
    const newRitual: DailyRitualItem = {
      id: `custom-${Date.now()}`,
      key: `custom_${Date.now()}`,
      title: title.trim(),
      category,
      icon: icon || '✨',
      targetValue,
      currentValue: 0,
      unit,
      completed: false,
      clinicalBenefit,
      timeOfDay: 'anytime',
      voicePrompt: {
        en: `Please remember to complete your daily routine: ${title}.`,
        as: `আপোনাৰ দৈনিক নিয়মটো পালন কৰক: ${title}`,
        hi: `कृपया अपनी दिनचर्या पूरी करें: ${title}`
      }
    };

    const rituals = [...this.currentDayData.rituals, newRitual];
    const percentage = this.calculatePercentage(rituals);
    const updatedDay: DailyRitualDay = {
      ...this.currentDayData,
      rituals,
      overallPercentage: percentage,
      updatedAt: Date.now()
    };

    this.currentDayData = updatedDay;
    this.saveToStorage(updatedDay);
    this.notifySubscribers();
    this.syncToCloud(updatedDay);
    return updatedDay;
  }

  public async deleteRitual(id: string): Promise<DailyRitualDay> {
    const rituals = this.currentDayData.rituals.filter((r) => r.id !== id);
    const percentage = this.calculatePercentage(rituals);
    const updatedDay: DailyRitualDay = {
      ...this.currentDayData,
      rituals,
      overallPercentage: percentage,
      updatedAt: Date.now()
    };

    this.currentDayData = updatedDay;
    this.saveToStorage(updatedDay);
    this.notifySubscribers();
    this.syncToCloud(updatedDay);
    return updatedDay;
  }

  public async setCaregiverNote(note: string): Promise<DailyRitualDay> {
    const updatedDay: DailyRitualDay = {
      ...this.currentDayData,
      caregiverNote: note,
      updatedAt: Date.now()
    };

    this.currentDayData = updatedDay;
    this.saveToStorage(updatedDay);
    this.notifySubscribers();
    this.syncToCloud(updatedDay);
    return updatedDay;
  }

  public speakRitualPrompt(ritual: DailyRitualItem, lang: Language) {
    playChimeSound();
    const voiceText =
      ritual.voicePrompt[lang] || ritual.voicePrompt.en || `${ritual.title}. ${ritual.clinicalBenefit}`;
    speakReminderText(voiceText, lang);
  }

  private async syncToCloud(dayData: DailyRitualDay) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const ritualDocRef = doc(db, 'users', user.uid, 'rituals', dayData.dateKey);
      await setDoc(ritualDocRef, dayData, { merge: true });
    } catch (e) {
      console.warn('Failed to sync daily rituals to Firestore (offline resilience active):', e);
    }
  }

  private async syncFromCloud(dateKey: string) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const ritualDocRef = doc(db, 'users', user.uid, 'rituals', dateKey);
      const snap = await getDoc(ritualDocRef);
      if (snap.exists()) {
        const cloudData = snap.data() as DailyRitualDay;
        if (cloudData.updatedAt > (this.currentDayData.updatedAt || 0)) {
          this.currentDayData = cloudData;
          this.saveToStorage(cloudData);
          this.notifySubscribers();
        }
      }
    } catch (e) {
      console.warn('Failed to fetch daily rituals from Firestore:', e);
    }
  }

  public getWeeklyHistory(): { dateKey: string; label: string; percentage: number; isToday: boolean }[] {
    const history = [];
    const todayKey = getTodayDateKey();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
      const dayData = this.loadFromStorage(dateKey);

      history.push({
        dateKey,
        label: i === 0 ? 'Today' : dayName,
        percentage: dayData.overallPercentage || 0,
        isToday: dateKey === todayKey
      });
    }

    return history;
  }
}

export const dailyRitualsEngine = new DailyRitualsEngine();
