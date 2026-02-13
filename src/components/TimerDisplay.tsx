import React from 'react';
import clsx from 'clsx';

interface TimerDisplayProps {
  totalTime: number; // in seconds
  remainingTime: number; // in seconds
  status: 'idle' | 'running' | 'paused';
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ totalTime, remainingTime, status }) => {
  const percentage = totalTime > 0 ? ((totalTime - remainingTime) / totalTime) * 100 : 0;
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center relative w-72 h-72">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: 0 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-blue-100"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={clsx(
            "text-blue-600 transition-all duration-1000 ease-linear",
            status === 'paused' && "opacity-70"
          )}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-blue-900 font-mono">
          {formattedTime}
        </span>
        <span className="text-sm text-gray-500 mt-2 uppercase tracking-widest font-semibold">
          {status === 'idle' ? 'Ready' : status}
        </span>
      </div>
    </div>
  );
};

export default TimerDisplay;
