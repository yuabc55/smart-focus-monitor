import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../hooks/useTimer';
import TimerDisplay from '../components/TimerDisplay';
import { Play, Pause, Square, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const { state } = useApp();
  const { startTimer, pauseTimer, stopTimer, remainingTime, status } = useTimer();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (state.currentSession?.status === 'pending') {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [state.currentSession?.status]);

  const handleStart = () => {
    startTimer();
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleStop = () => {
    if (confirm('Are you sure you want to stop the current session?')) {
      stopTimer();
    }
  };

  const handleCancelSchedule = () => {
    if (confirm('Cancel scheduled session?')) {
      stopTimer(); // Reuse stopTimer to clear session
    }
  };

  if (!state.currentSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Focus?</h2>
          <p className="text-gray-600 mb-8">
            Start a new focus session to boost your productivity.
          </p>
          <button
            onClick={() => navigate('/mode')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} />
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  // Handle Pending (Scheduled) State
  if (state.currentSession.status === 'pending' && state.currentSession.scheduledTime) {
    const scheduledTime = new Date(state.currentSession.scheduledTime);
    const diff = Math.max(0, Math.floor((scheduledTime.getTime() - now.getTime()) / 1000));
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center">
             <span className="text-sm font-semibold text-purple-500 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Scheduled Focus
            </span>
            <h2 className="text-gray-500 text-sm">Session starts at {format(scheduledTime, 'HH:mm')}</h2>
          </div>

          <div className="flex flex-col items-center justify-center w-72 h-72 rounded-full border-4 border-purple-100 bg-purple-50 mb-8">
             <Clock size={48} className="text-purple-400 mb-2" />
             <div className="text-4xl font-mono font-bold text-purple-900">
               {hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
             </div>
             <span className="text-sm text-purple-400 font-medium mt-2">UNTIL START</span>
          </div>

          <button
            onClick={handleCancelSchedule}
            className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-colors"
          >
            Cancel Schedule
          </button>
        </div>
      </div>
    );
  }

  const totalDuration = state.currentSession.duration * 60; // in seconds

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <span className="text-sm font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            {state.currentSession.mode === 'instant' ? 'Instant Focus' : 'Scheduled Focus'}
          </span>
          <h2 className="text-gray-500 text-sm">Stay focused, stay productive</h2>
        </div>

        <TimerDisplay
          totalTime={totalDuration}
          remainingTime={remainingTime}
          status={status}
        />

        <div className="flex items-center gap-6 mt-10">
          {status === 'running' ? (
            <button
              onClick={handlePause}
              className="p-4 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors shadow-sm"
              aria-label="Pause"
            >
              <Pause size={32} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="p-4 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors shadow-sm"
              aria-label="Start"
            >
              <Play size={32} fill="currentColor" />
            </button>
          )}

          <button
            onClick={handleStop}
            className="p-4 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm"
            aria-label="Stop"
          >
            <Square size={32} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
