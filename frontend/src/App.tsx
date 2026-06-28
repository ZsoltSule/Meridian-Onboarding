import { useEffect, useState } from 'react';
import axios from 'axios';
import { type Employee } from './types';

const API_BASE_URL = 'http://localhost:5102/api/employees';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="p-10 text-center font-medium text-gray-600">Loading Meridian Application...</div>;
  if (error) return <div className="p-10 text-center font-medium text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans antialiased">
      <header className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Meridian Onboarding Portal 🚀</h1>
        <p className="text-gray-500 mt-1">
          Your companion for the first month at Meridian. Hybrid work model (3 days in the office / 2 days remote).
        </p>
      </header>
      <main className="space-y-6">
        {employees.length === 0 ? (
          <p className="text-gray-500 italic">No registered employees found.</p>
        ) : (
          employees.map(employee => (
            <div
              key={employee.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{employee.fullName}</h2>
                <div className="flex gap-2 mt-1 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium text-gray-700">
                    💼 Role: {employee.role}
                  </span>
                  <span className="bg-blue-50 px-2.5 py-1 rounded-md font-medium text-blue-700">
                    🏢 Department: {employee.department}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 mb-3">
                Onboarding Checklist
              </h3>
              
              {employee.onboardingTasks.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No tasks assigned yet.</p>
              ) : (
                <ul className="space-y-2">
                  {employee.onboardingTasks.map(task => (
                    <li
                      key={task.id}
                      className={`flex items-start p-3.5 rounded-lg border transition-all duration-200 ${
                        task.isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleTask(employee.id, task.id)}
                        className="mt-1 mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-semibold text-base transition-all ${
                            task.isCompleted ? 'line-through text-green-700' : 'text-gray-800'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className={`text-sm mt-0.5 ${task.isCompleted ? 'text-green-600/80' : 'text-gray-500'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;