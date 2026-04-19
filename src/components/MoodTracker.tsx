import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Plus, History as HistoryIcon, Calendar as CalendarIcon, Save, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { Mood, MoodLog } from '../types';
import { MOODS } from '../constants';
import { cn } from '../lib/utils';
import { moodService } from '../services/dataService';
import { useAuth } from '../AuthContext';

export default function MoodTracker() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [view, setView] = useState<'log' | 'history'>('log');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    const logs = await moodService.getMoodLogs();
    setHistory(logs as any);
  };

  const handleSave = async () => {
    if (!selectedMood || isSaving) return;
    setIsSaving(true);
    try {
      await moodService.logMood(selectedMood, intensity, note);
      await loadHistory();
      setSelectedMood(null);
      setIntensity(5);
      setNote('');
      setView('history');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const chartData = [...history]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-7)
    .map(log => ({
      time: format(new Date(log.timestamp), 'MMM d, HH:mm'),
      intensity: log.intensity,
      mood: log.mood
    }));

  return (
    <div className="p-6 md:p-12 mb-24 md:mb-0 max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl text-lake">Emotional Flow</h2>
          <p className="text-stone/60 mt-2 italic">Tracking the tides of your inner world.</p>
        </div>
        <div className="flex bg-mist/50 backdrop-blur-sm p-1 rounded-2xl border border-stream/10">
          <button
            onClick={() => setView('log')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
              view === 'log' ? "bg-lake text-white shadow-md" : "text-stone/40 hover:text-lake"
            )}
          >
            Check-In
          </button>
          <button
            onClick={() => setView('history')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
              view === 'history' ? "bg-lake text-white shadow-md" : "text-stone/40 hover:text-lake"
            )}
          >
            History
          </button>
        </div>
      </header>

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'log' ? (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="space-y-6">
                <h3 className="text-2xl text-center text-lake font-serif italic">What is the state of your water?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {MOODS.map(m => (
                    <button
                      key={m.type}
                      onClick={() => setSelectedMood(m.type)}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all active:scale-95",
                        selectedMood === m.type 
                          ? "bg-white border-lake shadow-xl ring-2 ring-lake/10" 
                          : cn(m.color, "border-transparent opacity-60 hover:opacity-100")
                      )}
                    >
                      <span className="text-5xl mb-3">{m.emoji}</span>
                      <span className="font-bold text-sm uppercase tracking-wider">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-8 bg-white/70 backdrop-blur-md p-8 rounded-[40px] shadow-sm border border-stream/10"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-lake uppercase tracking-widest leading-none">Vibe Intensity</label>
                      <span className="text-2xl font-serif text-ocean">{intensity}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full accent-ocean h-2 bg-mist rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone/40 uppercase font-bold tracking-tighter">
                      <span>Low Tide</span>
                      <span>High Tide</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-lake uppercase tracking-widest">Observations</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Capture the ripples of your thoughts..."
                      className="w-full bg-mist/30 border-none rounded-3xl p-6 text-stone focus:ring-1 focus:ring-stream/20 placeholder:text-stone/30 resize-none h-32"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full bg-lake text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-lg shadow-lake/10 hover:bg-ocean transition-all flex items-center justify-center space-x-3"
                  >
                    <Save size={20} />
                    <span>Record Flow</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 h-full flex flex-col"
            >
              {/* Chart Section */}
              <div className="glass p-8 rounded-[40px] h-64 md:h-80 border border-stream/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                    <XAxis 
                      dataKey="time" 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#47556960' }}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      hide
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(8,51,68,0.05)', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="intensity" 
                      stroke="#0EA5E9" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorIntensity)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* History List */}
              <div className="flex-grow space-y-4 overflow-y-auto pb-12 pr-2">
                {history.map(log => {
                  const moodData = MOODS.find(m => m.type === log.mood);
                  return (
                    <div key={log.id} className="glass p-6 rounded-3xl flex items-start space-x-6 border-l-8" style={{ borderColor: moodData?.color.split(' ').at(-1)?.replace('border-', '') }}>
                      <span className="text-4xl leading-none">{moodData?.emoji}</span>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lake uppercase text-xs tracking-widest">{moodData?.label}</h4>
                            <p className="text-[10px] text-stone/40 font-medium lowercase">
                              {format(new Date(log.timestamp), 'EEEE, MMMM d • HH:mm')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 bg-mist px-3 py-1 rounded-full border border-stream/10">
                            <Activity size={12} className="text-ocean" />
                            <span className="text-xs font-bold text-ocean">{log.intensity}</span>
                          </div>
                        </div>
                        {log.note && (
                          <p className="text-sm text-stone/70 mt-2 italic">"{log.note}"</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
