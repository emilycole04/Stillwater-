import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Sun, Moon, Plus, Target, Sparkles, Smile } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { RoutineTask } from '../types';
import { routineService } from '../services/dataService';
import { useAuth } from '../AuthContext';

const INITIAL_ROUTINES: { id: string; title: string; icon: React.ReactNode; tasks: RoutineTask[] }[] = [
  {
    id: 'morning',
    title: 'Grounded Morning',
    icon: <Sun className="text-amber-500" size={24} />,
    tasks: [
      { id: 'm1', title: '5 Min Breathing', completed: false, frequency: 'daily' },
      { id: 'm2', title: 'Hydrate with Lemon', completed: false, frequency: 'daily' },
      { id: 'm3', title: 'Somatic Shake/Stretch', completed: false, frequency: 'daily' },
    ]
  },
  {
    id: 'evening',
    title: 'Soft Evening',
    icon: <Moon className="text-indigo-400" size={24} />,
    tasks: [
      { id: 'e1', title: 'Screen-Free Journaling', completed: false, frequency: 'daily' },
      { id: 'e2', title: 'Magnesium/Herbal Tea', completed: false, frequency: 'daily' },
      { id: 'e3', title: 'Lights Dim by 9 PM', completed: false, frequency: 'daily' },
    ]
  }
];

export default function RoutineSection() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState(INITIAL_ROUTINES);

  useEffect(() => {
    if (user) {
      loadRoutines();
    }
  }, [user]);

  const loadRoutines = async () => {
    const data = await routineService.getRoutines();
    if (data && data.length > 0) {
      // Mapping Firebase data to the visual structure
      // For now we assume the seed data or we could add routines to Firebase.
      // Logic: Update the 'completed' status of INITIAL_ROUTINES from Firebase if found.
      const updated = routines.map(r => {
        const fbRoutine = data.find(fbr => fbr.title === r.title);
        if (fbRoutine) {
          return {
            ...r,
            id: fbRoutine.id,
            tasks: r.tasks.map(t => {
               const fbTask = fbRoutine.tasks?.find((fbt: any) => fbt.title === t.title);
               return fbTask ? { ...t, id: fbTask.id, completed: fbTask.completed } : t;
            })
          };
        }
        return r;
      });
      setRoutines(updated as any);
    }
  };

  const toggleTask = async (rIdx: number, tId: string) => {
    const newRoutines = [...routines];
    const task = newRoutines[rIdx].tasks.find(t => t.id === tId);
    if (task) {
      const newStatus = !task.completed;
      task.completed = newStatus;
      setRoutines(newRoutines);
      
      // If the routine/task exists in Firebase, sync it
      if (routines[rIdx].id && task.id) {
        await routineService.toggleTask(routines[rIdx].id, task.id, newStatus);
      }
    }
  };

  const totalTasks = routines.reduce((acc, r) => acc + r.tasks.length, 0);
  const completedTasks = routines.reduce((acc, r) => acc + r.tasks.filter(t => t.completed).length, 0);
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Remaining', value: totalTasks - completedTasks },
  ];
  const COLORS = ['#14B8A6', '#F0F9FF'];

  return (
    <div className="p-6 md:p-12 mb-24 md:mb-0 max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h2 className="text-4xl text-lake">Daily Rhythms</h2>
          <p className="text-stone/60 mt-2 italic">Gentle anchors in the current of your day.</p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center space-x-6 glass px-8 py-4 rounded-3xl">
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={28}
                  outerRadius={38}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-lake">{completionRate}%</span>
              <Sparkles className="text-stream" size={16} />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone/40">Flow Progress</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {routines.map((routine, rIdx) => (
          <div key={routine.title} className="glass p-8 rounded-[40px] flex flex-col border border-stream/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/50 rounded-2xl shadow-sm border border-stream/10">
                  {routine.icon}
                </div>
                <h3 className="text-2xl text-lake">{routine.title}</h3>
              </div>
              <button className="text-stone/40 hover:text-lake transition-colors">
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4 flex-grow">
              {routine.tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(rIdx, task.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-5 rounded-3xl transition-all border",
                    task.completed
                      ? "bg-reef/10 border-reef text-lake"
                      : "bg-mist/30 border-transparent text-stone/60 hover:border-stream/20"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    {task.completed ? (
                      <CheckCircle2 className="text-reef" size={24} />
                    ) : (
                      <Circle className="text-stream/30" size={24} />
                    )}
                    <span className={cn(
                      "font-medium transition-all text-left",
                      task.completed && "line-through opacity-70"
                    )}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone/30">
                    {task.frequency}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between">
              <p className="text-xs text-stone/40 italic">
                {routine.tasks.filter(t => t.completed).length === routine.tasks.length
                   ? "You've fully honored this routine today."
                   : `${routine.tasks.filter(t => !t.completed).length} items remaining for your peace.`}
              </p>
              {routine.tasks.filter(t => t.completed).length === routine.tasks.length && (
                < Smile className="text-stream" size={20} />
              )}
            </div>
          </div>
        ))}

        {/* Affirmation / Intentionality Card */}
        <div className="md:col-span-2 glass bg-mist/50 border-stream/10 p-8 rounded-[40px] flex items-center justify-between">
          <div className="max-w-xl">
            <h4 className="flex items-center text-sm font-bold text-stream mb-3 uppercase tracking-wider">
              <Target size={16} className="mr-2" /> Weekly Flow
            </h4>
            <p className="text-2xl text-lake font-serif italic mb-2">
              "My body is a vessel of water, finding its own level of peace."
            </p>
            <p className="text-stone/40 text-sm">Focus: Fluid boundaries and deep restoration.</p>
          </div>
          <motion.div
            whileHover={{ rotate: 15 }}
            className="hidden md:block bg-stream/10 p-6 rounded-full"
          >
            <Sparkles className="text-stream" size={40} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
