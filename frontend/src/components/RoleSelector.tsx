import React, { useState, useEffect } from 'react';
import {type Employee } from '../types';

interface RoleSelectorProps {
  employees: Employee[];
  currentUser: string | number;
  onUserChange: (user: string | number) => void;
  darkMode: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ employees, currentUser, onUserChange, darkMode }) => {
  const [selectedDept, setSelectedDept] = useState<string>('HR');
  useEffect(() => {
    if (currentUser === 'HR') {
      setSelectedDept('HR');
    } else {
      const activeEmp = employees.find(e => e.id === currentUser);
      if (activeEmp) setSelectedDept(activeEmp.department);
    }
  }, [currentUser, employees]);
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const filteredEmployees = employees.filter(emp => emp.department === selectedDept);

  return (
    <div className={`p-4 rounded-xl mb-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Navigation & Role Simulator
        </h3>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Select view context to simulate scaling for 200+ employees.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="w-full sm:w-48">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Step 1: View Mode</label>
          <select
            value={selectedDept}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDept(val);
              if (val === 'HR') {
                onUserChange('HR');
              } else {
                const firstInDept = employees.find(emp => emp.department === val);
                if (firstInDept) onUserChange(firstInDept.id);
              }
            }}
            className={`p-2 rounded-lg border font-medium cursor-pointer outline-none w-full text-sm ${
              darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'
            }`}
          >
            <option value="HR">👩‍💼 HR Global View</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>📂 {dept} Dept.</option>
            ))}
          </select>
        </div>
        {selectedDept !== 'HR' && (
          <div className="w-full sm:w-64 animate-fadeIn">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Step 2: Select Employee</label>
            <select
              value={currentUser}
              onChange={(e) => onUserChange(Number(e.target.value))}
              className={`p-2 rounded-lg border font-medium cursor-pointer outline-none w-full text-sm ${
                darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'
              }`}
            >
              {filteredEmployees.length === 0 ? (
                <option value="">No employees in this dept.</option>
              ) : (
                filteredEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    👤 {emp.fullName} ({emp.role})
                  </option>
                ))
              )}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};