export type Mood = 'calm' | 'anxious' | 'neutral' | 'overwhelmed' | 'rested' | 'tense';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'somatic' | 'meditation' | 'breathwork';
  steps: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  content: string;
  prompt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  familyMember: string;
  category: 'cleaning' | 'work' | 'family' | 'wellness';
  color: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  completed: boolean;
  frequency: 'daily' | 'weekly';
}

export interface MoodLog {
  id: string;
  timestamp: string;
  mood: Mood;
  note?: string;
  intensity: number;
}
