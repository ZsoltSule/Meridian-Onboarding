import React from 'react';
import {type Employee } from '../types';

interface CompanyCalendarProps {
  employees: Employee[];
  darkMode: boolean;
}

export const CompanyCalendar: React.FC<CompanyCalendarProps> = ({ employees, darkMode }) => {
  const daysOfWeek = [
    { key: 'Mon', label: 'Monday' },
    { key: 'Tue', label: 'Tuesday' },
    { key: 'Wed', label: 'Wednesday' },
    { key: 'Thu', label: 'Thursday' },
    { key: 'Fri', label: 'Friday' },
  ];

  const getEmployeesForDay = (dayKey: string) => {
    return employees.filter(emp => emp.onsiteDays?.toLowerCase().includes(dayKey.toLowerCase()));
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 ${
      darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 shadow-md'
    }`}>
      <div className="mb-4">
        <h3 className="text-md font-bold flex items-center gap-2">
          📅 Meridian Office Attendance Calendar
        </h3>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          See which team members are working on-site today to plan your hybrid collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {daysOfWeek.map(day => {
          const attendees = getEmployeesForDay(day.key);
          
          return (
            <div 
              key={day.key} 
              className={`p-3 rounded-lg border flex flex-col min-h-[150px] ${
                darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500 block border-b pb-1 mb-2 border-gray-200 dark:border-gray-700">
                {day.label}
              </span>
              
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[180px] pr-1">
                {attendees.length === 0 ? (
                  <span className="text-[11px] italic text-gray-400 dark:text-gray-500 block mt-1">
                    No one scheduled
                  </span>
                ) : (
                  attendees.map(emp => (
                    <div 
                      key={emp.id} 
                      className={`p-1.5 rounded text-[11px] font-medium leading-tight border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white' 
                          : 'bg-white border-gray-200 text-gray-700 shadow-sm'
                      }`}
                      title={`${emp.fullName} - ${emp.role} (${emp.department})`}
                    >
                      <div className="truncate font-semibold">{emp.fullName}</div>
                      <div className="text-[10px] text-gray-400 truncate">{emp.department}</div>
                    </div>
                  ))
                )}
              </div>
              
              <span className="text-[10px] text-right text-gray-400 font-semibold mt-2 block pt-1 border-t border-gray-100 dark:border-gray-800">
                👥 Total: {attendees.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};