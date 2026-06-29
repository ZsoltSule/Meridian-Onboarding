import { useEffect, useState } from 'react';
import axios from 'axios';
import { type Employee } from './types';

const API_BASE_URL = 'http://localhost:5102/api/employees';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Employee[]>(API_BASE_URL);
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Could not connect to the backend. Please check the port and ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (employeeId: number, taskId: number) => {
    try {
      await axios.put(`${API_BASE_URL}/${employeeId}/tasks/${taskId}/toggle`);

      setEmployees(prevEmployees =>
        prevEmployees.map(emp => {
          if (emp.id === employeeId) {
            return {
              ...emp,
              onboardingTasks: emp.onboardingTasks.map(task => {
                if (task.id === taskId) {
                  return { ...task, isCompleted: !task.isCompleted };
                }
                return task;
              })
            };
          }
          return emp;
        })
      );
    } catch (err) {
      console.error("Error updating task:", err);
      alert("An error occurred while saving the task status.");
    }
  };

  if (loading) return <div className={`p-10 text-center font-medium ${darkMode ? 'text-gray-400 bg-gray-900' : 'text-gray-600 bg-gray-50'} min-h-screen`}>Loading Meridian Application...</div>;
  if (error) return <div className="p-10 text-center font-medium text-red-500">{error}</div>;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto p-6 font-sans antialiased">
        <header className={`border-b pb-5 mb-8 flex justify-between items-start ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex-1 pr-4">
            <h1 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Meridian Onboarding Portal 🚀
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your companion for the first month at Meridian. Hybrid work model (3 days in the office / 2 days remote).
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl transition-all text-xl shadow-sm cursor-pointer flex-shrink-0 font-medium border ${
              darkMode 
                ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' 
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>
        <main className="space-y-6">
          {employees.length === 0 ? (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No registered employees found.</p>
          ) : (
            employees.map(employee => {
              const totalTasks = employee.onboardingTasks.length;
              const completedTasks = employee.onboardingTasks.filter(t => t.isCompleted).length;
              const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={employee.id}
                  className={`border rounded-xl p-6 shadow-sm transition-all duration-200 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Profile Info */}
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
                        🏢 Department: {employee.department}
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
                      <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {completedTasks} of {totalTasks} tasks completed
                      </p>
                    </div>
                  )}
                  <h3 className={`text-sm font-semibold uppercase tracking-wider border-b pb-2 mb-3 ${
                    darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-100'
                  }`}>
                    Onboarding Checklist
                  </h3>
                  
                  {totalTasks === 0 ? (
                    <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      No tasks assigned yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {employee.onboardingTasks.map(task => (
                        <li
                          key={task.id}
                          className={`flex items-start p-3.5 rounded-lg border transition-all duration-200 ${
                            task.isCompleted 
                              ? (darkMode ? 'bg-green-950/30 border-green-800' : 'bg-green-50 border-green-200') 
                              : (darkMode ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-100 hover:border-gray-200')
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleToggleTask(employee.id, task.id)}
                            className={`mt-1 mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${
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
            })
          )}
        </main>
      </div>
    </div>
  );
}

export default App;