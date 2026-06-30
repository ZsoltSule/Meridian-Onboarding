import React, { useState } from 'react';

interface AddEmployeeFormProps {
  onEmployeeAdded: () => void;
  darkMode: boolean;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onEmployeeAdded, darkMode }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [assignedBuddy, setAssignedBuddy] = useState('');
  const [onsiteDays, setOnsiteDays] = useState('Mon, Tue, Wed'); 
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !role) {
      setMessage('❌ Please fill in the Name and Role fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5102/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          role,
          department,
          assignedBuddy,
          onsiteDays
        }),
      });

      if (response.ok) {
        setMessage('✅ Employee added successfully! Default onboarding tasks generated.');
        setFullName('');
        setRole('');
        setAssignedBuddy('');
        setOnsiteDays('Mon, Tue, Wed');
        onEmployeeAdded();
      } else {
        setMessage('❌ Failed to add employee.');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setMessage('❌ Connection error to the backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-md'
    }`}>
      <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        ➕ Onboard a New Employee (HR Action)
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Full Name *
            </label>
            <input 
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Popescu"
              className={`w-full p-2.5 rounded-lg border outline-none text-sm transition-colors ${
                darkMode ? 'bg-gray-950 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Job Title / Role *
            </label>
            <input 
              type="text" value={role} onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className={`w-full p-2.5 rounded-lg border outline-none text-sm transition-colors ${
                darkMode ? 'bg-gray-950 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Department
            </label>
            <select 
              value={department} onChange={(e) => setDepartment(e.target.value)}
              className={`w-full p-2.5 rounded-lg border outline-none text-sm cursor-pointer transition-colors ${
                darkMode ? 'bg-gray-950 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Assign Onboarding Buddy
            </label>
            <input 
              type="text" value={assignedBuddy} onChange={(e) => setAssignedBuddy(e.target.value)}
              placeholder="e.g. Maria Ionescu"
              className={`w-full p-2.5 rounded-lg border outline-none text-sm transition-colors ${
                darkMode ? 'bg-gray-950 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-xs font-semibold uppercase mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              On-site Days (Hybrid Setup)
            </label>
            <input 
              type="text" value={onsiteDays} onChange={(e) => setOnsiteDays(e.target.value)}
              placeholder="e.g. Mon, Tue, Wed"
              className={`w-full p-2.5 rounded-lg border outline-none text-sm transition-colors ${
                darkMode ? 'bg-gray-950 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
        </div>
        {message && (
          <p className={`text-xs font-medium p-2.5 rounded-lg ${
            message.startsWith('❌') 
              ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' 
              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
          }`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 shadow-sm ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
          }`}
        >
          {loading ? 'Creating Account...' : '✨ Create Employee Profile'}
        </button>
      </form>
    </div>
  );
};