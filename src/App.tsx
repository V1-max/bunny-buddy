 import { useState, useEffect } from 'react';
  import { AnimatePresence, motion } from 'framer-motion';
  import { VIBE_LIBRARY, type Vibe } from './vibes';
  import { useZenStore } from './store';
  import {
    Sparkles, Volume2, Play, Pause,
    RotateCcw, CheckCircle2, Circle, Plus,
    Heart, X, Leaf, MessageCircle, Send, Settings, User, Clock
  } from 'lucide-react';
  import { BUNNY_RESPONSES, type ResponseCategory } from './bunnyBrain';
  import { SOUNDS } from './sounds';

  function App() {
    const {
      timeLeft, isActive, mode, sessionsCompleted, totalRounds,
      tasks, toggleTimer, tick, addTask, toggleTask, deleteTask, resetTimer,
      currentView, setView, bunnyLove, petBunny
    } = useZenStore();

    const [taskInput, setTaskInput] = useState('');
    const [chatMessages, setChatMessages] = useState([{ role: 'bunny', text: "Hello, little bun! ♡" }]);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
      let interval: any = null;
      if (isActive) {
        interval = setInterval(() => {
          if (timeLeft === 1) {
            const audio = new Audio(SOUNDS.timerFinish);
            audio.volume = useZenStore.getState().volume / 100;
            audio.play();
          }
          tick();
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isActive, tick, timeLeft]);

    const formatTime = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m + ":" + (sec < 10 ? '0' : '') + sec;
    };

    const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      const text = chatInput.toLowerCase();
      setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
      setChatInput('');

      setTimeout(() => {
        const store = useZenStore.getState();
        const maps: Record<string, ResponseCategory> = {
          'tired': 'tired', 'sleepy': 'tired', 'exhausted': 'tired',
          'sad': 'sad', 'lonely': 'sad', 'cry': 'sad', 'unhappy': 'sad',
          'stress': 'stressed', 'anxious': 'stressed', 'panic': 'stressed', 'overwhelmed': 'stressed',
          'done': 'success', 'finished': 'success', 'completed': 'success', 'win': 'success',
          'help': 'stuck', 'hard': 'stuck', 'stuck': 'stuck', 'impossible': 'stuck',
          'hello': 'greeting', 'hi': 'greeting', 'hey': 'greeting',
          'love': 'love', 'cute': 'love', 'heart': 'love', 'adore': 'love',
          'break': 'break', 'rest': 'break', 'nap': 'break',
          'water': 'wellness', 'stretch': 'wellness', 'blink': 'wellness',
          'bored': 'bored', 'nothing': 'bored',
          'sorry': 'guilt', 'fail': 'guilt', 'bad': 'guilt',
          'proud': 'pride', 'great': 'pride', 'awesome': 'pride',
          'why': 'curious', 'how': 'curious', 'what': 'curious',
          'hungry': 'hunger', 'food': 'hunger', 'eat': 'hunger', 'snack': 'hunger',
        };

        let category: ResponseCategory = 'generic';

        for (const [kw, cat] of Object.entries(maps)) {
          if (text.includes(kw)) {
            category = cat;
            break;
          }
        }

        if (category === 'generic') {
          if (store.isActive && store.mode === 'work') category = 'focus_mode';
          else if (store.isActive && store.mode === 'break') category = 'break_mode';
        }

        const options = BUNNY_RESPONSES[category];
        const res = options[Math.floor(Math.random() * options.length)];
        setChatMessages(prev => [...prev, { role: 'bunny', text: res }]);
      }, 1000);
    };

    return (
      <div className="min-h-screen w-full bg-[#FFF8ED] flex items-center justify-center p-6 relative overflow-hidden
  font-sans text-[#66534B]">

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Bunny Nook */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-6">
            <div className="bg-white/70 p-8 rounded-[50px] border-4 border-white shadow-xl text-center relative w-full">
              <div className="relative h-40 flex items-center justify-center cursor-pointer" onClick={petBunny}>
                <div className="text-8xl">🐰</div>
              </div>
              <div className="space-y-1 mt-4">
                <h2 className="text-2xl font-black text-[#DDAAB8]">Bunny Buddy</h2>
                <p className="text-sm italic text-slate-400">"Your cozy helper"</p>
              </div>
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(sessionsCompleted)].map((_, i) => (<Heart key={i} size={14} className="fill-pink-300
  text-pink-300" />))}
                <div className="ml-2 text-[10px] font-bold text-pink-300">Love: {bunnyLove}</div>
              </div>
            </div>
          </div>

          {/* CENTER: Focus Area */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-12">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium text-slate-400 italic">hello, {(useZenStore.getState().userName ||
  'little bun').toLowerCase()} ♡</h3>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 border-2 border-dashed border-pink-100 rounded-[80px] rotate-3" />
              <div className="relative bg-white/80 p-12 rounded-[60px] shadow-2xl border-4 border-white text-center
  w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-sm font-bold uppercase text-pink-300">{mode === 'work' ? 'Deep Focus' : 'Bunny Break'}</div>

                  <div className="flex gap-2">
                    {[...Array(totalRounds)].map((_, i) => (
                      <div key={i} className="relative w-6 h-6">
                        <Heart
                          size={24}
                          className={`transition-colors duration-500 ${i < sessionsCompleted ? 'text-pink-400 fill-pink-400' : 'text-pink-200'}`}
                        />
                        {i === sessionsCompleted && isActive && mode === 'work' && (
                          <motion.div
                            initial={{ height: '0%' }}
                            animate={{ height: '100%' }}
                            className="absolute bottom-0 left-0 right-0 bg-pink-400/40 rounded-full pointer-events-none"
                            style={{ height: `${((useZenStore.getState().workDuration - timeLeft) /
  useZenStore.getState().workDuration) * 100}%` }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-8xl font-black text-slate-700 tabular-nums">{formatTime(timeLeft)}</div>
                <div className="flex gap-6 justify-center">
                  <button onClick={toggleTimer} className="p-6 rounded-full bg-pink-400 text-white shadow-lg">{isActive
  ? <Pause size={32} /> : <Play size={32} />}</button>
                  <button onClick={resetTimer} className="p-6 rounded-full bg-white text-slate-300 border-2
  border-white"><RotateCcw size={32} /></button>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView('chat')} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white
  text-slate-500 border-2 border-white shadow-sm text-sm font-bold"><MessageCircle size={18} /> Talk to Bunny</button>
              <button onClick={() => setView('settings')} className="p-3 rounded-full bg-white text-slate-400 border-2
  border-white shadow-sm"><Settings size={20} /></button>
            </div>
          </div>

          {/* RIGHT: Goals */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#FDFCFB] p-6 rounded-[30px] shadow-sm border-2 border-white space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-500"><Leaf size={20}
  className="text-green-400" /> Goals</h3>
              <div className="flex gap-2">
                <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} onKeyDown={(e) =>
  e.key === 'Enter' && (addTask(taskInput), setTaskInput(''))} placeholder="Goal..." className="flex-1 bg-white/50
  border-2 border-white rounded-2xl px-3 py-2 text-xs outline-none" />
                <button onClick={() => { addTask(taskInput); setTaskInput(''); }} className="p-2 bg-pink-400 text-white
  rounded-2xl"><Plus size={18} /></button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-white
  shadow-sm group">
                    <div onClick={() => toggleTask(t.id)} className="cursor-pointer">{t.completed ? <CheckCircle2
  size={18} className="text-pink-400" /> : <Circle size={18} className="text-slate-200" />}</div>
                    <span className={`flex-1 text-xs font-medium ${t.completed ? 'line-through text-slate-300' :
  'text-slate-500'}`}>{t.text}</span>
                    <button onClick={() => deleteTask(t.id)} className="opacity-0 group-hover:opacity-100 p-1
  text-slate-300 hover:text-red-300"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {currentView === 'chat' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20
  backdrop-blur-sm">
              <div className="bg-[#FFF8ED] w-full max-w-md h-[600px] rounded-[40px] border-8 border-white shadow-2xl
  flex flex-col overflow-hidden relative">
                <div className="bg-pink-100 p-4 flex justify-between items-center border-b-2 border-white">
                  <span className="font-bold text-pink-600 flex items-center gap-2">🐰 Bunny Chat</span>
                  <button onClick={() => setView('home')} className="p-1 hover:bg-pink-200 rounded-full
  transition-all"><X size={20} className="text-pink-400" /></button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    const cls = isUser ? 'bg-pink-400 text-white rounded-tr-none' : 'bg-white text-slate-600 border border-pink-100 rounded-tl-none';
                    return (
                      <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${cls}`}>{msg.text}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 bg-white/50 border-t-2 border-white flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) =>
  e.key === 'Enter' && handleSendMessage()} placeholder="Message Bunny..." className="flex-1 bg-white rounded-full px-4
  py-2 text-sm outline-none border border-pink-100" />
                  <button onClick={handleSendMessage} className="p-2 bg-pink-400 text-white rounded-full
  shadow-sm"><Send size={18} /></button>
                </div>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20
  backdrop-blur-sm">
              <div className="bg-[#FFF8ED] w-full max-w-md h-[600px] rounded-[40px] border-8 border-white shadow-2xl
  flex flex-col overflow-hidden relative">
                <div className="bg-pink-100 p-4 flex justify-between items-center border-b-2 border-white">
                  <span className="font-bold text-pink-600 flex items-center gap-2"><Settings size={20}/>
  Settings</span>
                  <button onClick={() => setView('home')} className="p-1 hover:bg-pink-200 rounded-full
  transition-all"><X size={20} className="text-pink-400" /></button>
                </div>
                <div className="flex-1 p-8 overflow-y-auto space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center
  gap-2"><User size={16}/> Profile</h4>
                    <input type="text" value={useZenStore.getState().userName} onChange={(e) =>
  useZenStore.getState().setUserName(e.target.value)} className="w-full bg-white border-2 border-pink-100 rounded-2xl
  px-4 py-2 text-sm outline-none" placeholder="Your name..." />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center
  gap-2"><Clock size={16}/> Pomodoro</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Work</label>
                        <input type="number" value={useZenStore.getState().workDuration / 60} onChange={(e) =>
  useZenStore.getState().setWorkDuration(Number(e.target.value))} className="w-full bg-white border-2 border-pink-100
  rounded-xl px-3 py-2 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Break</label>
                        <input type="number" value={useZenStore.getState().breakDuration / 60} onChange={(e) =>
  useZenStore.getState().setBreakDuration(Number(e.target.value))} className="w-full bg-white border-2 border-pink-100
  rounded-xl px-3 py-2 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Rounds</label>
                        <input type="number" value={useZenStore.getState().totalRounds} onChange={(e) =>
  useZenStore.getState().setTotalRounds(Number(e.target.value))} className="w-full bg-white border-2 border-pink-100
  rounded-xl px-3 py-2 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center
  gap-2"><Volume2 size={16}/> Audio</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400">0%</span>
                      <input type="range" min="0" max="100" value={useZenStore.getState().volume} onChange={(e) =>
  useZenStore.getState().setVolume(Number(e.target.value))} className="flex-1 accent-pink-400" />
                      <span className="text-xs text-slate-400">100%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center
  gap-2"><Sparkles size={16}/> Bunny Mood</h4>
                    <div className="flex gap-2">
                      {['quiet', 'normal', 'chatty'].map(level => (
                        <button key={level} onClick={() => useZenStore.getState().setChattiness(level as any)}
  className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all
  ${useZenStore.getState().bunnyChattiness === level ? 'bg-pink-400 text-white' : 'bg-white text-slate-400 border border-pink-100'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  export default App;