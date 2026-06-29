import React from 'react';
import { type Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  darkMode: boolean;
  onToggleTask: (employeeId: number, taskId: number) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, darkMode, onToggleTask }) => {
  const totalTasks = employee.onboardingTasks.length;
  const completedTasks = employee.onboardingTasks.filter(t => t.isCompleted).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`border rounded-xl p-6 shadow-sm transition-all duration-200 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="mb-4">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {employee.fullName}
        </h2>
        <div className="flex gap-2 mt-1 text-sm">
          <span className={`px-2.5 py-1 rounded-md font-medium ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            💼 Role: {employee.role}
          </span>
          <span className={`px-2.5 py-1 rounded-md font-medium ${
            darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            🏢 Dept: {employee.department}
          </span>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className={`mb-6 p-4 rounded-lg border ${
          darkMode ? 'bg-gray-900/50 border-gray-700/60' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex justify-between items-center mb-1.5">
            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Onboarding Progress
            </span>
            <span className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {progressPercentage}%
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                darkMode ? 'bg-green-400' : 'bg-green-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <h3 className={`text-sm font-semibold uppercase tracking-wider border-b pb-2 mb-3 ${
        darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-100'
      }`}>
        Onboarding Checklist
      </h3>
      
      {totalTasks === 0 ? (
        <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {employee.onboardingTasks.map(task => (
            <li key={task.id} className={`flex items-start p-3.5 rounded-lg border transition-all duration-200 ${
              task.isCompleted 
                ? (darkMode ? 'bg-green-950/30 border-green-800' : 'bg-green-50 border-green-200') 
                : (darkMode ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-100 hover:border-gray-200')
            }`}>
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => onToggleTask(employee.id, task.id)}
                className={`mt-1 mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer ${
                  darkMode ? 'bg-gray-700 border-gray-600' : ''
                }`}
              />
              <div className="flex-1">
                <p className={`font-semibold text-base transition-all ${
                  task.isCompleted 
                    ? (darkMode ? 'line-through text-green-400' : 'line-through text-green-700') 
                    : (darkMode ? 'text-gray-200' : 'text-gray-800')
                }`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-sm mt-0.5 ${
                    task.isCompleted 
                      ? (darkMode ? 'text-green-500/80' : 'text-green-600/80') 
                      : (darkMode ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};