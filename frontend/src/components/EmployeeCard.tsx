import React, { useState } from 'react';
import { type Employee, type OnboardingTask } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  darkMode: boolean;
  currentUser: string | number; 
  onToggleTask: (employeeId: number, taskId: number) => Promise<void>;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  darkMode, 
  currentUser,
  onToggleTask 
}) => {
  const isHr = currentUser === 'HR';
  const [localTasks, setLocalTasks] = useState<OnboardingTask[]>(employee.onboardingTasks);
  const [isSaving, setIsSaving] = useState(false);
  React.useEffect(() => {
    setLocalTasks(employee.onboardingTasks);
  }, [employee.onboardingTasks]);
  const hasChanges = localTasks.some((localTask) => {
    const originalTask = employee.onboardingTasks.find(t => t.id === localTask.id);
    return originalTask ? originalTask.isCompleted !== localTask.isCompleted : false;
  });
  const handleLocalCheckboxChange = (taskId: number) => {
    if (isHr) return; 
    
    setLocalTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };
  const handleConfirmChanges = async () => {
    setIsSaving(true);
    try {
      for (const localTask of localTasks) {
        const originalTask = employee.onboardingTasks.find(t => t.id === localTask.id);
        if (originalTask && originalTask.isCompleted !== localTask.isCompleted) {
          await onToggleTask(employee.id, localTask.id);
        }
      }
    } catch (err) {
      console.error("Failed to save changes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 ${
      darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 shadow-md'
    }`}>
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-bold">{employee.fullName}</h3>
          <p className="text-xs text-gray-400">{employee.role} • <span className="font-semibold text-blue-500">{employee.department}</span></p>
        </div>
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          🗓️ On-Site: {employee.onsiteDays || 'None'}
        </span>
      </div>
      <div className="space-y-2.5">
        {localTasks.map(task => {
          const original = employee.onboardingTasks.find(t => t.id === task.id);
          const isDirty = original ? original.isCompleted !== task.isCompleted : false;
          const nameToDisplay = (task as any).taskName || (task as any).title || (task as any).name || 'Unnamed Task';

          return (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                task.isCompleted 
                  ? (darkMode ? 'bg-green-950/20 border-green-900/50' : 'bg-green-50/60 border-green-100') 
                  : (darkMode ? 'bg-gray-900/40 border-gray-700/60' : 'bg-gray-50/50 border-gray-100')
              } ${isDirty ? 'ring-1 ring-amber-500/50 border-amber-500/50' : ''}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input 
                  type="checkbox"
                  checked={task.isCompleted}
                  disabled={isHr} 
                  onChange={() => handleLocalCheckboxChange(task.id)}
                  className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                    isHr ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                />
                <div className="truncate">
                  <span className={`text-sm font-medium block truncate ${
                    task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''
                  }`}>
                    {nameToDisplay}
                  </span>
                  <span className="text-[10px] text-gray-400 block truncate">{task.description}</span>
                </div>
              </div>
              {isDirty && (
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide bg-amber-500/10 px-1.5 py-0.5 rounded animate-pulse shrink-0 ml-2">
                  Unsaved
                </span>
              )}
            </div>
          );
        })}
      </div>
      {!isHr && hasChanges && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleConfirmChanges}
            disabled={isSaving}
            className={`px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 ${
              isSaving ? 'opacity-50 cursor-wait' : 'cursor-pointer'
            }`}
          >
            {isSaving ? 'Saving...' : '💾 Confirm Changes'}
          </button>
        </div>
      )}
    </div>
  );
};