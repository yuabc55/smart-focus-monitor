import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FocusSession } from '../types';
import { Clock, Calendar, Zap } from 'lucide-react';
import clsx from 'clsx';

// Helper to generate ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const ModeSelection: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'instant' | 'scheduled'>('instant');
  const [duration, setDuration] = useState<number>(state.settings.defaultDuration);
  const [scheduledTime, setScheduledTime] = useState<string>('');

  const durations = [15, 25, 30, 45, 60];

  const handleStartInstant = () => {
    const session: FocusSession = {
      id: generateId(),
      mode: 'instant',
      duration: duration,
      status: 'running',
      startTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({
      type: 'START_FOCUS',
      payload: { session, duration: duration * 60 },
    });
    navigate('/');
  };

  const handleSchedule = () => {
    if (!scheduledTime) {
      alert('Please select a start time');
      return;
    }

    const start = new Date(scheduledTime);
    if (start <= new Date()) {
      alert('Scheduled time must be in the future');
      return;
    }

    const session: FocusSession = {
      id: generateId(),
      mode: 'scheduled',
      duration: duration,
      status: 'pending',
      scheduledTime: start,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({
      type: 'SCHEDULE_FOCUS',
      payload: { session },
    });
    navigate('/');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Select Focus Mode</h1>
      
      {/* Mode Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => setMode('instant')}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all",
            mode === 'instant' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Zap size={18} />
          Instant Start
        </button>
        <button
          onClick={() => setMode('scheduled')}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all",
            mode === 'scheduled' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Calendar size={18} />
          Scheduled
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        {/* Duration Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock size={16} />
            Focus Duration (minutes)
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={clsx(
                  "py-2 px-4 rounded-lg border text-sm font-medium transition-colors",
                  duration === d
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-600"
                )}
              >
                {d} min
              </button>
            ))}
            <input
              type="number"
              placeholder="Custom"
              className={clsx(
                "py-2 px-4 rounded-lg border text-sm font-medium transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-500",
                !durations.includes(duration) && duration > 0
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600"
              )}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              value={!durations.includes(duration) ? duration : ''}
            />
          </div>
        </div>

        {/* Scheduled Time Input */}
        {mode === 'scheduled' && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={mode === 'instant' ? handleStartInstant : handleSchedule}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          {mode === 'instant' ? 'Start Focus Now' : 'Schedule Focus'}
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
