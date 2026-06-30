import React from 'react';
import {type Employee } from '../types';

interface TeamScheduleProps {
  employee: Employee;
  darkMode: boolean;
}

export const TeamSchedule: React.FC<TeamScheduleProps> = ({ employee, darkMode }) => {
  const buddyName = employee.assignedBuddy || "Senior Team Buddy";
  const officeDays = employee.onsiteDays || "Mon, Tue, Wed";

  return (
    <div className={`p-5 rounded-xl border mb-6 ${
      darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-200' : 'bg-blue-50/50 border-blue-100 text-gray-800'
    }`}>
      <h3 className="text-md font-bold flex items-center gap-2 mb-3">
        🗓️ Your Hybrid Work & Connection Hub
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-white shadow-sm'}`}>
          <span className="text-xs font-semibold text-gray-400 block uppercase">Your Office Schedule</span>
          <p className="mt-1 font-medium text-emerald-500">🏢 On-site Days: {officeDays}</p>
          <p className="text-xs text-gray-400 mt-1">Remaining 2 days: Remote work setup.</p>
        </div>

        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-white shadow-sm'}`}>
          <span className="text-xs font-semibold text-gray-400 block uppercase">Assigned Buddy / Mentor</span>
          <p className="mt-1 font-medium">🤝 {buddyName}</p>
          
          <div className="mt-2 flex gap-2">
            <a 
              href="https://slack.com" target="_blank" rel="noreferrer"
              className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
            >
              💬 Slack Chat
            </a>
            <a 
              href="https://meet.google.com" target="_blank" rel="noreferrer"
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              📹 Schedule Meet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};