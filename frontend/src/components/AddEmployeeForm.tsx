import React, { useState } from 'react';
import {type Employee } from '../types';

interface AddEmployeeFormProps {
  onAdd: (newEmployee: Employee) => void;
  darkMode: boolean;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onAdd, darkMode }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !role.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5102/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, role, department })
      });

      if (response.ok) {
        const data = await response.json();
        onAdd(data);
        setFullName('');
        setRole('');
        setDepartment('Engineering');
      } else {
        alert('Failed to add employee.');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`p-5 mb-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
    >
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        ➕ Onboard New Employee
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
          <input 
            type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. John Doe"
            className={`w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</label>
          <input 
            type="text" required value={role} onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. QA Engineer"
            className={`w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department</label>
          <select 
            value={department} onChange={(e) => setDepartment(e.target.value)}
            className={`w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'}`}
          >
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Adding...' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};