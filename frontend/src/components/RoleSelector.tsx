import React from 'react';
import {type Employee } from '../types';

interface RoleSelectorProps {
  employees: Employee[];
  currentUser: string | number; 
  onUserChange: (user: string | number) => void;
  darkMode: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ employees, currentUser, onUserChange, darkMode }) => {
  return (
    <div className={`p-4 rounded-xl mb-6 border flex items-center justify-between ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Role Switcher
        </h3>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Select who is viewing the application
        </p>
      </div>
      
      <select
        value={currentUser}
        onChange={(e) => {
          const val = e.target.value;
          onUserChange(val === 'HR' ? 'HR' : Number(val));
        }}
        className={`p-2 rounded-lg border font-medium cursor-pointer outline-none transition-colors ${
          darkMode 
            ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-blue-500' 
            : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-blue-500'
        }`}
      >
        <option value="HR">👩‍💼 HR View (All Employees)</option>
        <optgroup label="New Employee View">
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              👤 {emp.fullName}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};