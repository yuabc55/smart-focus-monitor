import { openDB, DBSchema } from 'idb';

interface FocusRecord {
  id: string;
  sessionId: string;
  actualDuration: number;            // 实际专注时长（分钟）
  date: Date;
  achievement?: string;               // 获得的成就
  createdAt: Date;
}

interface MyDB extends DBSchema {
  focusRecords: {
    key: string;
    value: FocusRecord;
    indexes: { 'by-date': Date };
  };
}

const DB_NAME = 'FocusMonitor';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('focusRecords')) {
        const store = db.createObjectStore('focusRecords', { keyPath: 'id' });
        store.createIndex('by-date', 'date');
      }
    },
  });
};

export const saveFocusRecord = async (record: FocusRecord) => {
  const db = await initDB();
  return db.add('focusRecords', record);
};

export const getAllFocusRecords = async () => {
  const db = await initDB();
  return db.getAllFromIndex('focusRecords', 'by-date');
};

export const getFocusRecordsByDateRange = async (start: Date, end: Date) => {
  const db = await initDB();
  return db.getAllFromIndex('focusRecords', 'by-date', IDBKeyRange.bound(start, end));
};
