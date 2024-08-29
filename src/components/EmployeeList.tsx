import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc'; // Import trpc utility
// interface
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  telephoneNumber: string;
  emailAddress: string;
  status: boolean; 
  managerId: string;
}

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  const router = useRouter();
  const deactivateEmployee = trpc.employee.update.useMutation(); 

  console.log('Employees:', employees);
// handle edit and deactivate
  const handleEdit = (id: string) => {
    router.push(`/employees/${id}/edit`);
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
          await deactivateEmployee.mutateAsync({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            telephoneNumber: employee.telephoneNumber,
            emailAddress: employee.emailAddress,
            managerId: employee.managerId,
            status: false,
          });
          router.reload();
        }
      } catch (error) {
        console.error('Failed to deactivate employee:', error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '10%' }}>Actions</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '15%' }}>First Name</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '15%' }}>Last Name</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '15%' }}>Telephone</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '20%' }}>Email Address</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '15%' }}>Manager</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '10%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(employee.id)}
                      className="text-blue-500 hover:underline text-xs px-2 py-1 rounded border border-blue-500"
                    >
                      Edit
                    </button>
                    {employee.status && (
                      <button
                        onClick={() => handleDeactivate(employee.id)}
                        className="text-red-500 hover:underline text-xs px-2 py-1 rounded border border-red-500"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-xs">{employee.firstName}</td>
                  <td className="py-2 px-4 border-b text-xs">{employee.lastName}</td>
                  <td className="py-2 px-4 border-b text-xs">{employee.telephoneNumber}</td>
                  <td className="py-2 px-4 border-b text-xs">{employee.emailAddress}</td>
                  <td className="py-2 px-4 border-b text-xs">{employee.managerId}</td>
                  <td className="py-2 px-4 border-b text-xs">{employee.status ? 'Active' : 'Inactive'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-2 px-4 border-b text-center text-xs">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 bg-gray-200 p-4">
        <p>Filter options go here</p>
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded p-1 w-4/5 md:w-3/4 text-xs">
            {/* Filter options */}
          </select>
          {/* Add more filters as needed */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
