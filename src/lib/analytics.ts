// src/lib/analytics.ts

export interface AnalyticsEvent {
  id: string;
  type: 'pageview' | 'click' | 'chat_query' | 'form_submit';
  label: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

const STORAGE_KEY = 'iks_archive_analytics_events';

export const trackEvent = (
  type: AnalyticsEvent['type'],
  label: string,
  metadata?: Record<string, any>
) => {
  if (typeof window === 'undefined') return;

  const newEvent: AnalyticsEvent = {
    id: Math.random().toString(36).substring(2, 9),
    type,
    label,
    metadata,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.unshift(newEvent);
    // Keep last 100 events locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.error('Failed to log event:', err);
  }
};

export const getStoredEvents = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};