  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  interface Task {
    id: number;
    text: string;
    completed: boolean;
  }

  interface ZenState {
    workDuration: number;
    breakDuration: number;
    timeLeft: number;
    isActive: boolean;
    mode: 'work' | 'break';
    sessionsCompleted: number;
    totalRounds: number;
    currentRound: number;
    volume: number;
    bunnyChattiness: 'quiet' | 'normal' | 'chatty';
    userName: string;
    bunnyMood: 'happy' | 'focused' | 'sleeping' | 'excited' | 'encouraging';
    bunnyLove: number;
    tasks: Task[];
    currentView: 'home' | 'focus' | 'chat' | 'settings';

    setWorkDuration: (mins: number) => void;
    setBreakDuration: (mins: number) => void;
    setTotalRounds: (rounds: number) => void;
    setVolume: (val: number) => void;
    setChattiness: (val: ZenState['bunnyChattiness']) => void;
    setUserName: (name: string) => void;
    toggleTimer: () => void;
    tick: () => void;
    addTask: (text: string) => void;
    toggleTask: (id: number) => void;
    deleteTask: (id: number) => void;
    resetTimer: () => void;
    petBunny: () => void;
    setBunnyMood: (mood: ZenState['bunnyMood']) => void;
    setView: (view: ZenState['currentView']) => void;
  }

  export const useZenStore = create<ZenState>()(
    persist(
      (set) => ({
        workDuration: 25 * 60,
        breakDuration: 5 * 60,
        timeLeft: 25 * 60,
        isActive: false,
        mode: 'work',
        sessionsCompleted: 0,
        totalRounds: 4,
        currentRound: 1,
        volume: 50,
        bunnyChattiness: 'normal',
        userName: 'little bun',
        bunnyMood: 'happy',
        bunnyLove: 0,
        tasks: [],
        currentView: 'home',

        setWorkDuration: (mins) => set({ workDuration: mins * 60, timeLeft: mins * 60 }),
        setBreakDuration: (mins) => set({ breakDuration: mins * 60 }),
        setTotalRounds: (rounds) => set({ totalRounds: rounds, currentRound: 1, timeLeft: 25 * 60 }),
        setVolume: (val) => set({ volume: val }),
        setChattiness: (val) => set({ bunnyChattiness: val }),
        setUserName: (name) => set({ userName: name.toLowerCase() }),
        toggleTimer: () => set((state) => ({ isActive: !state.isActive, bunnyMood: !state.isActive ? 'focused' : 'happy'
  })),
        tick: () => set((state) => {
          if (state.timeLeft <= 0) {
            const nextMode = state.mode === 'work' ? 'break' : 'work';
            const nextTime = nextMode === 'work' ? state.workDuration : state.breakDuration;

            const isCycleComplete = state.mode === 'break' && state.currentRound >= state.totalRounds;

            return {
              mode: nextMode,
              timeLeft: nextTime,
              isActive: true,
              currentRound: isCycleComplete ? 1 : (nextMode === 'work' ? state.currentRound + 1 : state.currentRound),
              sessionsCompleted: isCycleComplete ? 0 : (state.mode === 'work' ? state.sessionsCompleted + 1 : state.sessionsCompleted),
              bunnyMood: 'excited'
            };
          }
          return { timeLeft: state.timeLeft - 1 };
        }),
        addTask: (text) => set((state) => ({ tasks: [...state.tasks, { id: Date.now(), text, completed: false }] })),
        toggleTask: (id) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed
  } : t) })),
        deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
        resetTimer: () => set((state) => ({ timeLeft: state.mode === 'work' ? state.workDuration : state.breakDuration,
  isActive: false })),
        petBunny: () => set((state) => ({ bunnyLove: state.bunnyLove + 1, bunnyMood: 'happy' })),
        setBunnyMood: (mood) => set({ bunnyMood: mood }),
        setView: (view) => set({ currentView: view }),
      }),
      { name: 'bunny-buddy-storage' }
    )
  );