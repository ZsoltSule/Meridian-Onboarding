import { useEffect, useState } from 'react';
import axios from 'axios'; 
import { type Employee } from './types';
import { Header } from './components/Header';
import { EmployeeCard } from './components/EmployeeCard';
import { RoleSelector } from './components/RoleSelector';
import { AddEmployeeForm } from './components/AddEmployeeForm';
import { TeamSchedule } from './components/TeamSchedule';
import { CompanyCalendar } from './components/CompanyCalendar'; 

const API_BASE_URL = 'http://localhost:5102/api/employees';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | number>('HR');
  const [hrSelectedEmployeeId, setHrSelectedEmployeeId] = useState<number | 'NONE'>('NONE');
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (employeeId: number, taskId: number) => {
    try {
      await axios.put(`${API_BASE_URL}/${employeeId}/tasks/${taskId}/toggle`);
      setEmployees(prev => prev.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            onboardingTasks: emp.onboardingTasks.map(task => 
              task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            )
          };
        }
        return emp;
      }));
    } catch (err) {
      console.error("Error updating task:", err);
      alert("An error occurred while saving the task status.");
      throw err;
    }
  };

  if (loading) return <div className={`p-10 text-center font-medium ${darkMode ? 'text-gray-400 bg-gray-900' : 'text-gray-600 bg-gray-50'} min-h-screen`}>Loading Meridian Application...</div>;
  if (error) return <div className="p-10 text-center font-medium text-red-500">{error}</div>;
  const visibleEmployees = currentUser === 'HR' 
    ? (hrSelectedEmployeeId === 'NONE' ? [] : employees.filter(emp => emp.id === hrSelectedEmployeeId))
    : employees.filter(emp => emp.id === currentUser);
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-6 font-sans antialiased"> 
        <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
        
        <RoleSelector 
          employees={employees} 
          currentUser={currentUser} 
          onUserChange={setCurrentUser} 
          darkMode={darkMode} 
          hrSelectedEmployeeId={hrSelectedEmployeeId}
          onHrSelectedEmployeeChange={setHrSelectedEmployeeId}
        />

        <main className="space-y-6">
          {currentUser !== 'HR' && visibleEmployees.length > 0 && (
            <>
              <TeamSchedule employee={visibleEmployees[0]} darkMode={darkMode} />
              <CompanyCalendar employees={employees} darkMode={darkMode} />
            </>
          )}
          
          {currentUser === 'HR' && (
            <>
              <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                <h2 className="text-xl font-bold">HR Dashboard Overview</h2>
                <p className="text-sm">Manage new hires and track their onboarding progress.</p>
              </div>
              <AddEmployeeForm onEmployeeAdded={fetchEmployees} darkMode={darkMode} />
              <div className="mt-8">
                <CompanyCalendar employees={employees} darkMode={darkMode} />
              </div>
            </>
          )}
          
          {currentUser === 'HR' && <h3 className={`text-md font-bold mt-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Onboarding Tracks</h3>}
          
          {visibleEmployees.length === 0 ? (
            currentUser === 'HR' && hrSelectedEmployeeId === 'NONE' ? (
              <div className={`p-6 text-center border-2 border-dashed rounded-xl ${darkMode ? 'border-gray-700 text-gray-400 bg-gray-800/20' : 'border-gray-200 text-gray-500 bg-gray-50'}`}>
                💡 <span className="font-medium">Please select an employee from the dropdown above to inspect their onboarding progress.</span>
              </div>
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No employees found.</p>
            )
          ) : (
            visibleEmployees.map(employee => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                darkMode={darkMode} 
                currentUser={currentUser} 
                onToggleTask={handleToggleTask} 
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default App;