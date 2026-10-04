/**
 * Smaran AI - Local Activity & Telemetry Store (No Authentication Required)
 */

export interface ActivityLog {
  id: string;
  game: string;
  score: number;
  details?: any;
  timestamp: number;
}

const STORAGE_KEY = 'Smaran_activity_logs';

export const getActivities = (): ActivityLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read activities:', e);
  }
  return [];
};

export const logActivity = (game: string, score: number, details?: any): ActivityLog => {
  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    game,
    score,
    details: details || {},
    timestamp: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getActivities();
      const updated = [newLog, ...current].slice(0, 100); // keep last 100 logs
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save activity:', e);
    }
  }

  return newLog;
};
