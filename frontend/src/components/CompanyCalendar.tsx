import React, { useState } from 'react';
import {type Employee } from '../types';

interface CompanyCalendarProps {
  employees: Employee[];
  darkMode: boolean;
}

export const CompanyCalendar: React.FC<CompanyCalendarProps> = ({ employees, darkMode }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

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

  const activeDayDetails = daysOfWeek.find(d => d.key === expandedDay);
  const activeAttendees = expandedDay ? getEmployeesForDay(expandedDay) : [];

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 relative ${
      darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 shadow-md'
    }`}>
      <div className="mb-4">
        <h3 className="text-md font-bold flex items-center gap-2">
          📅 Meridian Office Attendance
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {daysOfWeek.map(day => {
          const attendees = getEmployeesForDay(day.key);
          
          const visibleAttendees = attendees.slice(0, 3);
          const hiddenCount = attendees.length - 3;
          
          return (
            <div 
              key={day.key} 
              className={`p-3 rounded-lg border flex flex-col min-h-[160px] ${
                darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500 block border-b pb-1 mb-2 border-gray-200 dark:border-gray-700">
                {day.label}
              </span>
              
              <div className="space-y-1.5 flex-1">
                {attendees.length === 0 ? (
                  <span className="text-[11px] italic text-gray-400 dark:text-gray-500 block mt-1">
                    No one scheduled
                  </span>
                ) : (
                  visibleAttendees.map(emp => (
                    <div 
                      key={emp.id} 
                      className={`p-1.5 rounded text-[11px] font-medium leading-tight border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-gray-300' 
                          : 'bg-white border-gray-200 text-gray-700 shadow-sm'
                      }`}
                      title={`${emp.fullName} - ${emp.role}`}
                    >
                      <div className="truncate font-semibold">{emp.fullName}</div>
                      <div className="text-[10px] text-gray-400 truncate">{emp.department}</div>
                    </div>
                  ))
                )}
                {hiddenCount > 0 && (
                  <button 
                    onClick={() => setExpandedDay(day.key)}
                    className={`mt-2 py-1 px-2 w-full rounded-md text-[10px] font-bold text-center border transition-colors cursor-pointer ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                        : 'bg-gray-200 border-gray-300 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
                    }`}
                  >
                    +{hiddenCount} others
                  </button>
                )}
              </div>
              
              <span className="text-[10px] text-right text-gray-400 font-semibold mt-2 block pt-1 border-t border-gray-100 dark:border-gray-800">
                👥 Total: {attendees.length}
              </span>
            </div>
          );
        })}
      </div>
      {expandedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm p-6 rounded-xl shadow-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {activeDayDetails?.label} Roster
              </h3>
              <button 
                onClick={() => setExpandedDay(null)}
                className="text-gray-400 hover:text-red-500 transition-colors font-bold text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className={`max-h-[310px] overflow-y-auto space-y-2 pr-2
              [scrollbar-width:thin]
              ${darkMode ? '[scrollbar-color:#4b5563_transparent]' : '[scrollbar-color:#d1d5db_transparent]'}
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              ${darkMode 
                ? '[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500' 
                : '[&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'
              }
            `}>
              {activeAttendees.map(emp => (
                <div 
                  key={emp.id} 
                  className={`p-3 rounded-lg border flex justify-between items-center ${
                    darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {emp.fullName}
                    </div>
                    <div className="text-xs text-gray-500">{emp.role}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {emp.department}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setExpandedDay(null)}
              className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};