 export type Vibe = {
    name: string;
    bgGradient: string;
    accentColor: string;
    soundscape: string;
    description: string;
  };

  export const VIBE_LIBRARY: Record<string, Vibe> = {
    coding: {
      name: 'Deep Code',
      bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
      accentColor: 'text-purple-400',
      soundscape: 'electronic-hum',
      description: 'Focused, synthetic, and rhythmic.',
    },
    writing: {
      name: 'Creative Flow',
      bgGradient: 'from-orange-100 via-rose-200 to-orange-100',
      accentColor: 'text-rose-600',
      soundscape: 'cafe-ambience',
      description: 'Warm, inviting, and inspired.',
    },
    studying: {
      name: 'Zen Study',
      bgGradient: 'from-emerald-900 via-teal-800 to-emerald-900',
      accentColor: 'text-emerald-400',
      soundscape: 'rain-forest',
      description: 'Calm, organic, and steady.',
    },
    default: {
      name: 'Neutral',
      bgGradient: 'from-gray-800 via-gray-700 to-gray-800',
      accentColor: 'text-gray-300',
      soundscape: 'white-noise',
      description: 'Balanced and clear.',
    },
  };