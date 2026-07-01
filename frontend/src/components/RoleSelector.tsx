import React, { useState, useEffect } from 'react';
import { type Employee } from '../types';

interface RoleSelectorProps {
  employees: Employee[];
  currentUser: string | number;
  onUserChange: (user: string | number) => void;
  darkMode: boolean;

  hrSelectedEmployeeId: number | 'NONE';
  onHrSelectedEmployeeChange: (id: number | 'NONE') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  employees, 
  currentUser, 
  onUserChange, 
  darkMode,
  hrSelectedEmployeeId,
  onHrSelectedEmployeeChange
}) => {
  const [mode, setMode] = useState<'HR' | 'EMPLOYEE'>(currentUser === 'HR' ? 'HR' : 'EMPLOYEE');
  const [selectedDept, setSelectedDept] = useState<string>('Engineering');

  useEffect(() => {
    if (currentUser === 'HR') {
      setMode('HR');
    } else {
      setMode('EMPLOYEE');
      const activeEmp = employees.find(e => e.id === currentUser);
      if (activeEmp) setSelectedDept(activeEmp.department);
    }
  }, [currentUser, employees]);

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const filteredEmployees = employees.filter(emp => emp.department === selectedDept);

  const handleModeChange = (newMode: 'HR' | 'EMPLOYEE') => {
    setMode(newMode);
    if (newMode === 'HR') {
      onUserChange('HR');
      onHrSelectedEmployeeChange('NONE');
    } else {
      const firstInDept = employees.find(emp => emp.department === selectedDept);
      onUserChange(firstInDept ? firstInDept.id : -1);
    }
  };

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    const firstInDept = employees.find(emp => emp.department === dept);
    
    if (mode === 'HR') {
      onHrSelectedEmployeeChange(firstInDept ? firstInDept.id : 'NONE');
    } else {
      onUserChange(firstInDept ? firstInDept.id : -1);
    }
  };

  return (
    <div className={`p-2 px-4 rounded-xl mb-4 border flex flex-col lg:flex-row items-center justify-center gap-4 w-fit mx-auto transition-colors ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-center items-center">
        <div className="w-full sm:w-40 shrink-0 text-center sm:text-left">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Step 1: Role</label>
          <select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value as 'HR' | 'EMPLOYEE')}
            className={`p-2 rounded-lg border font-medium cursor-pointer outline-none w-full text-sm text-center ${
              darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'
            }`}
          >
            <option value="HR">👩‍💼 HR Mode</option>
            <option value="EMPLOYEE">👤 Employee Mode</option>
          </select>
        </div>
        {(mode === 'EMPLOYEE' || mode === 'HR') && (
          <>
            <div className="w-full sm:w-44 shrink-0 animate-fadeIn text-center sm:text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                {mode === 'HR' ? 'HR: Filter Dept' : 'Step 2: Department'}
              </label>
              <select
                value={selectedDept}
                onChange={(e) => handleDeptChange(e.target.value)}
                className={`p-2 rounded-lg border font-medium cursor-pointer outline-none w-full text-sm text-center ${
                  darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'
                }`}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-56 shrink-0 animate-fadeIn text-center sm:text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                {mode === 'HR' ? 'HR: Inspect Employee' : 'Step 3: Employee'}
              </label>
              <select
                value={mode === 'HR' ? hrSelectedEmployeeId : currentUser}
                onChange={(e) => {
                  const val = e.target.value;
                  if (mode === 'HR') {
                    onHrSelectedEmployeeChange(val === 'NONE' ? 'NONE' : Number(val));
                  } else {
                    onUserChange(Number(val));
                  }
                }}
                className={`p-2 rounded-lg border font-medium cursor-pointer outline-none w-full text-sm text-center ${
                  darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'
                }`}
              >
                {mode === 'HR' && <option value="NONE">-- Select an Employee --</option>}
                
                {filteredEmployees.length === 0 ? (
                  <option value="-1" disabled>No employees found.</option>
                ) : (
                  filteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};