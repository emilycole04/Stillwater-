import { Exercise, Mood } from './types';

export const MOODS: { type: Mood; label: string; emoji: string; color: string }[] = [
  { type: 'overwhelmed', label: 'Overwhelmed', emoji: '🫠', color: 'bg-ocean/10 text-lake border-ocean/20' },
  { type: 'anxious', label: 'Anxious', emoji: '🫀', color: 'bg-sarah/10 text-ocean border-sarah/20' },
  { type: 'calm', label: 'Calm', emoji: '🌿', color: 'bg-reef/10 text-lake border-reef/20' },
  { type: 'rested', label: 'Rested', emoji: '✨', color: 'bg-stream/10 text-lake border-stream/20' },
  { type: 'tense', label: 'Tense', emoji: '🧠', color: 'bg-stone/10 text-lake border-stone/20' },
  { type: 'neutral', label: 'Balanced', emoji: '🧘', color: 'bg-mist text-lake border-black/5' },
];

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'A simple technique to calm the nervous system.',
    duration: '5 mins',
    category: 'breathwork',
    steps: [
      'Inhale quietly through your nose for 4 seconds.',
      'Hold your breath for 7 seconds.',
      'Exhale completely through your mouth, making a whoosh sound for 8 seconds.'
    ]
  },
  {
    id: '2',
    title: 'Progressive Muscle Relaxation',
    description: 'Release tension throughout your entire body.',
    duration: '10 mins',
    category: 'somatic',
    steps: [
      'Find a comfortable position.',
      'Starting from your toes, tense each muscle group for 5 seconds.',
      'Release the tension suddenly and feel the muscle relax for 10 seconds.',
      'Move slowly up to your calves, knees, thighs, and so on.'
    ]
  },
  {
    id: '3',
    title: 'Vagus Nerve Pull',
    description: 'Gently stimulate the vagus nerve for immediate calm.',
    duration: '2 mins',
    category: 'somatic',
    steps: [
      'Place your fingers behind your ears.',
      'Gently pull down and slightly out.',
      'Take deep belly breaths as you do this.',
      'Hold for 30-60 seconds until you feel a sigh or yawn.'
    ]
  },
  {
    id: '4',
    title: 'Loving Kindness Meditation',
    description: 'Foster self-compassion and gentleness.',
    duration: '15 mins',
    category: 'meditation',
    steps: [
      'Close your eyes and breathe.',
      'Repeat silently: May I be safe. May I be healthy. May I be happy.',
      'Visualize sending this light to yourself, then to others.'
    ]
  }
];

export const FAMILY_MEMBERS = [
  { name: 'Mom', color: '#818CF8' },
  { name: 'Sarah', color: '#60A5FA' },
  { name: 'Tom', color: '#4ADE80' },
  { name: 'Maya', color: '#F472B6' }
];

export const CATEGORIES = ['cleaning', 'work', 'family', 'wellness'];
