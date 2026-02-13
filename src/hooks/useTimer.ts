import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { saveFocusRecord } from '../utils/db';
import { FocusRecord } from '../types';

// Simple UUID generator if uuid package is not installed
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useTimer = () => {
  const { state, dispatch } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for scheduled start
    if (state.currentSession?.status === 'pending' && state.currentSession.scheduledTime) {
      const checkScheduled = setInterval(() => {
        if (state.currentSession && state.currentSession.scheduledTime && new Date() >= new Date(state.currentSession.scheduledTime)) {
          dispatch({ type: 'RESUME_FOCUS' });
          // Optional: Update session startTime here if needed, but RESUME_FOCUS handles status
        }
      }, 1000);
      return () => clearInterval(checkScheduled);
    }

    if (state.timer.status === 'running' && state.timer.remainingTime > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER', payload: state.timer.remainingTime - 1 });
      }, 1000);
    } else if (state.timer.status === 'running' && state.timer.remainingTime <= 0) {
      // Timer finished
      handleComplete();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.timer.status, state.timer.remainingTime, dispatch]);

  const handleComplete = async () => {
    if (state.currentSession) {
      const record: FocusRecord = {
        id: generateId(),
        sessionId: state.currentSession.id,
        actualDuration: state.currentSession.duration, // Assuming full completion
        date: new Date(),
        achievement: 'Focus Master', // Simple placeholder logic
        createdAt: new Date(),
      };
      
      try {
        await saveFocusRecord(record);
        if (state.settings.notificationEnabled) {
          new Notification("Focus Session Completed!", {
            body: "Great job! Take a break.",
          });
        }
        if (state.settings.soundEnabled) {
          // Play sound (placeholder)
          const audio = new Audio('/notification.mp3'); // Need to ensure file exists or use system sound
          audio.play().catch(e => console.log("Audio play failed", e));
        }
      } catch (error) {
        console.error("Failed to save record", error);
      }
      
      dispatch({ type: 'COMPLETE_FOCUS', payload: { record } });
    }
  };

  const startTimer = () => {
    dispatch({ type: 'RESUME_FOCUS' });
  };

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_FOCUS' });
  };

  const stopTimer = () => {
    dispatch({ type: 'STOP_FOCUS' });
  };

  return {
    startTimer,
    pauseTimer,
    stopTimer,
    remainingTime: state.timer.remainingTime,
    status: state.timer.status,
  };
};
