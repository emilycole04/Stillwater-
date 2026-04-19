import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAMILY_MEMBERS, CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { CalendarEvent } from '../types';
import { calendarService } from '../services/dataService';
import { useAuth } from '../AuthContext';

export default function CalendarSection() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    const data = await calendarService.getEvents();
    setEvents(data as any);
  };

  const handleAddTask = async () => {
    const newEvent = {
        title: 'New Family Anchor',
        date: format(currentDate, 'yyyy-MM-dd'),
        familyMember: 'Self',
        category: 'wellness',
        color: '#0EA5E9'
    };
    await calendarService.saveEvent(newEvent);
    await loadEvents();
  };
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="p-6 md:p-12 mb-24 md:mb-0 h-full flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl text-lake">{format(currentDate, 'MMMM yyyy')}</h2>
          <p className="text-stone/60 mt-1 italic">Mapping the currents of your family's week.</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-mist rounded-full transition-colors border border-stream/10 text-stone/40 hover:text-lake">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-mist rounded-full transition-colors border border-stream/10 text-stone/40 hover:text-lake">
            <ChevronRight size={20} />
          </button>
          <button 
            onClick={handleAddTask}
            className="bg-lake text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-ocean transition-colors ml-4 shadow-lg shadow-ocean/10"
          >
            <Plus size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Mark Task</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-grow glass rounded-[32px] overflow-hidden flex flex-col border border-stream/5">
          <div className="grid grid-cols-7 border-b border-stream/10">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-bold text-lake/30 uppercase tracking-[0.2em] bg-mist/30">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-grow">
            {days.map((day, idx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayEvents = events.filter(e => e.date === dayStr);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[100px] border-r border-b border-stream/10 p-2 transition-colors relative",
                    !isSameMonth(day, monthStart) && "bg-mist/10",
                    isToday(day) && "bg-ocean/5"
                  )}
                >
                  <span className={cn(
                    "inline-block px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest",
                    isToday(day) ? "bg-lake text-white shadow-sm" : "text-stone/30"
                  )}>
                    {format(day, 'd')}
                  </span>

                  <div className="mt-2 space-y-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className="px-2 py-1 text-[10px] rounded-md truncate text-white font-medium"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend / Family Filter */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="glass p-6 rounded-3xl border border-stream/5">
            <h4 className="flex items-center text-sm font-bold text-lake mb-6 uppercase tracking-wider">
              <Users size={16} className="mr-2 text-stream" /> Family Reef
            </h4>
            <div className="space-y-4">
              {FAMILY_MEMBERS.map(member => (
                <div key={member.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: member.color }} />
                    <span className="text-xs font-bold text-stone/60 group-hover:text-lake transition-colors">{member.name}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-reef animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-stream/5">
            <h4 className="text-xs font-bold text-lake mb-6 uppercase tracking-widest leading-none">The Lookout</h4>
            <div className="space-y-4">
              {events.slice(0, 3).map(event => (
                <div key={event.id} className="border-l-4 pl-4 py-1" style={{ borderColor: event.color }}>
                  <p className="text-xs font-bold text-lake">{event.title}</p>
                  <p className="text-[10px] text-stone/40 font-medium tracking-wide">Flow • {event.familyMember}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
