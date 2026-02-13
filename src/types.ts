export interface FocusSession {
  id: string;
  mode: 'instant' | 'scheduled';  // 随时开始或定时开启
  duration: number;                   // 专注时长（分钟）
  status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  scheduledTime?: Date;              // 定时开启时间
  createdAt: Date;
  updatedAt: Date;
}

export interface FocusRecord {
  id: string;
  sessionId: string;
  actualDuration: number;            // 实际专注时长（分钟）
  date: Date;
  achievement?: string;               // 获得的成就
  createdAt: Date;
}

export interface UserSettings {
  defaultDuration: number;            // 默认专注时长
  soundEnabled: boolean;              // 是否开启声音提醒
  notificationEnabled: boolean;        // 是否开启通知
  theme: 'light' | 'dark';         // 主题模式
  dailyGoal: number;                 // 每日专注目标（分钟）
}

export interface AppState {
  currentSession: FocusSession | null;
  timer: {
    remainingTime: number; // seconds
    status: 'idle' | 'running' | 'paused';
  };
  settings: UserSettings;
  history: FocusRecord[];
}
