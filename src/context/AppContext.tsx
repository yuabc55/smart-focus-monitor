import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { AppState, FocusSession, FocusRecord, UserSettings } from '../types';
import { getAllFocusRecords } from '../utils/db';

// Initial State
const initialSettings: UserSettings = {
  defaultDuration: 25,
  soundEnabled: true,
  notificationEnabled: true,
  theme: 'light',
  dailyGoal: 120,
};

const initialState: AppState = {
  currentSession: null,
  timer: {
    remainingTime: 0,
    status: 'idle',
  },
  settings: initialSettings,
  history: [],
};

// Actions
type Action =
  | { type: 'START_FOCUS'; payload: { session: FocusSession; duration: number } }
  | { type: 'SCHEDULE_FOCUS'; payload: { session: FocusSession } }
  | { type: 'PAUSE_FOCUS' }
  | { type: 'RESUME_FOCUS' }
  | { type: 'STOP_FOCUS' }
  | { type: 'COMPLETE_FOCUS'; payload: { record: FocusRecord } }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'LOAD_HISTORY'; payload: FocusRecord[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> };

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_FOCUS':
      return {
        ...state,
        currentSession: action.payload.session,
        timer: { remainingTime: action.payload.duration, status: 'running' },
      };
    case 'SCHEDULE_FOCUS':
      return {
        ...state,
        currentSession: action.payload.session,
        timer: { remainingTime: action.payload.session.duration * 60, status: 'idle' }, // Timer is idle until start time
      };
    case 'PAUSE_FOCUS':
      return {
        ...state,
        timer: { ...state.timer, status: 'paused' },
        currentSession: state.currentSession
          ? { ...state.currentSession, status: 'paused' }
          : null,
      };
    case 'RESUME_FOCUS':
      return {
        ...state,
        timer: { ...state.timer, status: 'running' },
        currentSession: state.currentSession
          ? { ...state.currentSession, status: 'running' }
          : null,
      };
    case 'STOP_FOCUS':
      return {
        ...state,
        currentSession: null,
        timer: { remainingTime: 0, status: 'idle' },
      };
    case 'COMPLETE_FOCUS':
      return {
        ...state,
        currentSession: null,
        timer: { remainingTime: 0, status: 'idle' },
        history: [...state.history, action.payload.record],
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: { ...state.timer, remainingTime: action.payload },
      };
    case 'LOAD_HISTORY':
      return {
        ...state,
        history: action.payload,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getAllFocusRecords();
        // Convert dates from string/IDB format back to Date objects if needed
        // idb usually stores Date objects as Date objects, so it should be fine.
        dispatch({ type: 'LOAD_HISTORY', payload: history });
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };
    loadHistory();
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
