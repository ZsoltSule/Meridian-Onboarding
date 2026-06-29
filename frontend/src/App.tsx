import { useEffect, useState } from 'react';
import axios from 'axios';
import { type Employee } from './types';
import { Header } from './components/Header';
import { EmployeeCard } from './components/EmployeeCard';
import { RoleSelector } from './components/RoleSelector';
import { AddEmployeeForm } from './components/AddEmployeeForm';

const API_BASE_URL = 'http://localhost:5102/api/employees';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | number>('HR');
  
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
    }
  };
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  if (loading) return <div className={`p-10 text-center font-medium ${darkMode ? 'text-gray-400 bg-gray-900' : 'text-gray-600 bg-gray-50'} min-h-screen`}>Loading Meridian Application...</div>;
  if (error) return <div className="p-10 text-center font-medium text-red-500">{error}</div>;

  const visibleEmployees = currentUser === 'HR' 
    ? employees 
    : employees.filter(emp => emp.id === currentUser);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto p-6 font-sans antialiased">
        <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
        
        <RoleSelector 
          employees={employees} 
          currentUser={currentUser} 
          onUserChange={setCurrentUser} 
          darkMode={darkMode} 
        />

        <main className="space-y-6">
          {currentUser === 'HR' && (
            <>
              <div className={`mb-4 pb-2 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                <h2 className="text-xl font-bold">HR Dashboard Overview</h2>
                <p className="text-sm">Manage new hires and track their onboarding progress.</p>
              </div>
              
              {/* Formularul va fi vizibil doar pentru HR */}
              <AddEmployeeForm onAdd={handleAddEmployee} darkMode={darkMode} />
            </>
          )}

          {visibleEmployees.length === 0 ? (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No employees found.</p>
          ) : (
            visibleEmployees.map(employee => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                darkMode={darkMode} 
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