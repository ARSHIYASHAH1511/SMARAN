import localforage from 'localforage';
import { imgBihu, imgCourtyard, imgDiyas } from '../assets/images';

localforage.config({
  name: 'SmaranAI',
  storeName: 'memories',
});

export interface Memory {
  id: string;
  objectId?: string; // Links to a 3D object in the Memory Palace
  image: string | null; // Base64 encoded image or URL
  description: string;
  date: number;
  estimatedYear?: number;
  estimatedDecade?: string;
  eraTitle?: string;
  keyPeople?: string[];
  culturalSetting?: string;
  reminiscenceCue?: string;
  aiAnalyzed?: boolean;
  chronologyConfidence?: number;
  chapter?: 'roots' | 'family' | 'festivals' | 'golden_years';
  patientVoiceNote?: string;
}

export const getMemories = async (): Promise<Memory[]> => {
  const memories = await localforage.getItem<Memory[]>('memories');
  return memories || [];
};

export const saveMemory = async (memory: Memory): Promise<void> => {
  const memories = await getMemories();
  const existingIndex = memories.findIndex((m) => m.id === memory.id);
  if (existingIndex >= 0) {
    memories[existingIndex] = memory;
  } else {
    memories.push(memory);
  }
  await localforage.setItem('memories', memories);
};

export const deleteMemory = async (id: string): Promise<void> => {
  const memories = await getMemories();
  const filtered = memories.filter((m) => m.id !== id);
  await localforage.setItem('memories', filtered);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const CURATED_SAMPLE_MEMORIES: Memory[] = [
  {
    id: 'sample-5',
    image: 'https://images.unsplash.com/photo-1588523326792-5eb326848d79?auto=format&fit=crop&q=80&w=800',
    description: 'A trip to the beautiful tea gardens in Upper Assam. The air was fresh and scented with rain.',
    date: new Date('1974-04-14').getTime(),
    estimatedYear: 1974,
    estimatedDecade: '1970s',
    eraTitle: 'Youth & Early Roots in the Tea Gardens',
    keyPeople: ['Young Ananya', 'Husband Bikram'],
    culturalSetting: 'Jorhat Camellia Tea Estate',
    reminiscenceCue: 'Do you remember the sweet, crisp aroma of the morning tea leaves after the gentle shower? Look at the endless rolling green hills.',
    aiAnalyzed: true,
    chronologyConfidence: 95,
    chapter: 'roots'
  },
  {
    id: 'sample-4',
    image: 'https://images.unsplash.com/photo-1542838685-6119859f5a04?auto=format&fit=crop&q=80&w=800',
    description: 'Enjoying a quiet afternoon tea with dearest childhood friend Kalyani on the veranda.',
    date: new Date('1986-11-20').getTime(),
    estimatedYear: 1986,
    estimatedDecade: '1980s',
    eraTitle: 'Afternoon Tea & Lifelong Friendships',
    keyPeople: ['Ananya', 'Childhood Friend Kalyani'],
    culturalSetting: 'Veranda in Tezpur',
    reminiscenceCue: 'A warm cup of ginger tea in fine porcelain cups. Can you recall the sweet laughter and memories you shared that afternoon?',
    aiAnalyzed: true,
    chronologyConfidence: 91,
    chapter: 'family'
  },
  {
    id: 'sample-3',
    image: imgDiyas,
    description: 'Lighting the brass diyas on the veranda during Diwali. The entire courtyard was glowing with peace.',
    date: new Date('1998-10-19').getTime(),
    estimatedYear: 1998,
    estimatedDecade: '1990s',
    eraTitle: 'Diwali Lights & Home Warmth',
    keyPeople: ['Ananya', 'Husband Bikram', 'Young Children'],
    culturalSetting: 'Family Courtyard Veranda',
    reminiscenceCue: 'Look at how warmly the brass diyas are glowing along the doorway. Who was holding the matchbox and helping you light the first flame?',
    aiAnalyzed: true,
    chronologyConfidence: 94,
    chapter: 'family'
  },
  {
    id: 'sample-2',
    image: imgBihu,
    description: 'Our family gathering during Rongali Bihu. Draped in traditional Muga silk with so much music, Pitha, and joy.',
    date: new Date('2012-04-14').getTime(),
    estimatedYear: 2012,
    estimatedDecade: '2010s',
    eraTitle: 'Rongali Bihu Spring Celebration',
    keyPeople: ['Whole Family', 'Sisters', 'Nieces & Nephews'],
    culturalSetting: 'Rongali Bihu Spring Gathering',
    reminiscenceCue: 'Listen to the memory of the Dhol and Pepa songs. Do you remember rolling the Til Pitha together in the warm kitchen before everyone arrived?',
    aiAnalyzed: true,
    chronologyConfidence: 97,
    chapter: 'festivals'
  },
  {
    id: 'sample-1',
    image: imgCourtyard,
    description: 'A sunny afternoon with the grandchildren playing in the brick courtyard by the Tulsi plant.',
    date: new Date('2018-02-10').getTime(),
    estimatedYear: 2018,
    estimatedDecade: '2010s',
    eraTitle: 'Grandchildren in the Courtyard',
    keyPeople: ['Grandmother Ananya', 'Grandchildren Aarav & Diya'],
    culturalSetting: 'Home Courtyard by Tulsi Manch',
    reminiscenceCue: 'Look at little Aarav and Diya running across the courtyard. Can you remember the afternoon folk story you told them right here?',
    aiAnalyzed: true,
    chronologyConfidence: 96,
    chapter: 'golden_years'
  }
];

export const seedDatabase = async () => {
  const memories = await getMemories();
  if (memories.length === 0) {
    await localforage.setItem('memories', CURATED_SAMPLE_MEMORIES);
  } else {
    // If existing memories lack the enriched timeline fields, upgrade them
    let needsUpdate = false;
    const upgraded = memories.map((m) => {
      const match = CURATED_SAMPLE_MEMORIES.find((s) => s.id === m.id);
      if (match && !m.estimatedYear) {
        needsUpdate = true;
        return { ...m, ...match };
      }
      return m;
    });
    if (needsUpdate) {
      await localforage.setItem('memories', upgraded);
    }
  }
};
