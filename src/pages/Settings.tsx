import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Volume2, Clock, Target, Moon } from 'lucide-react';
import clsx from 'clsx';

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const { settings } = state;

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: !settings[key] } });
    }
  };

  const handleChange = (key: keyof typeof settings, value: number | string) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-600">
            Preferences
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Volume2 size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Sound Effects</div>
                  <div className="text-xs text-gray-500">Play sound on completion</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('soundEnabled')}
                className={clsx(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.soundEnabled ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                <div className={clsx(
                  "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm",
                  settings.soundEnabled ? "left-6.5" : "left-0.5"
                )} style={{ left: settings.soundEnabled ? 'calc(100% - 1.25rem - 2px)' : '2px' }} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Notifications</div>
                  <div className="text-xs text-gray-500">Show desktop notifications</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('notificationEnabled')}
                className={clsx(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.notificationEnabled ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                <div className={clsx(
                  "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm",
                  settings.notificationEnabled ? "left-6.5" : "left-0.5"
                )} style={{ left: settings.notificationEnabled ? 'calc(100% - 1.25rem - 2px)' : '2px' }} />
              </button>
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                  <Moon size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Dark Mode</div>
                  <div className="text-xs text-gray-500">Coming soon</div>
                </div>
              </div>
              <button disabled className="w-12 h-6 rounded-full bg-gray-200 cursor-not-allowed relative">
                 <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Goals */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-600">
            Goals & Defaults
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Target size={16} /> Daily Goal (minutes)
              </label>
              <input
                type="number"
                value={settings.dailyGoal}
                onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} /> Default Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.defaultDuration}
                onChange={(e) => handleChange('defaultDuration', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </section>
        
        <div className="text-center text-xs text-gray-400 mt-8">
          Smart Focus Monitor v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Settings;
