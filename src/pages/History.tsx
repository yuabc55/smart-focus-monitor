import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Clock, Calendar, Award } from 'lucide-react';
import { FocusRecord } from '../types';

const History: React.FC = () => {
  const { state } = useApp();
  const { history } = state;

  const stats = useMemo(() => {
    const todayRecords = history.filter(r => isToday(new Date(r.date)));
    const totalMinutes = todayRecords.reduce((acc, curr) => acc + curr.actualDuration, 0);
    const totalSessions = todayRecords.length;
    return { totalMinutes, totalSessions };
  }, [history]);

  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: FocusRecord[] } = {};
    
    // Sort by date desc
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sorted.forEach(record => {
      const date = new Date(record.date);
      let key = format(date, 'yyyy-MM-dd');
      if (isToday(date)) key = 'Today';
      else if (isYesterday(date)) key = 'Yesterday';
      else key = format(date, 'MMM d, yyyy');

      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
    });

    return groups;
  }, [history]);

  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Progress</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Clock size={18} />
            <span className="text-sm font-medium">Focus Time Today</span>
          </div>
          <div className="text-3xl font-bold">
            {stats.totalMinutes}<span className="text-lg font-normal opacity-80 ml-1">min</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Award size={18} className="text-orange-500" />
            <span className="text-sm font-medium">Sessions Today</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {stats.totalSessions}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-6">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p>No focus history yet.</p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([dateLabel, records]) => (
            <div key={dateLabel}>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                {dateLabel}
              </h3>
              <div className="space-y-3">
                {records.map(record => (
                  <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{record.actualDuration} min Focus</div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(record.date), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    {record.achievement && (
                       <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                         {record.achievement}
                       </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
