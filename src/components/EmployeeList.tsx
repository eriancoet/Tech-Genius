import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc'; // Import trpc utility

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  telephoneNumber: string;
  emailAddress: string;
  status: string;
  managerId: string;
}

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  const router = useRouter();
  const deleteEmployee = trpc.employee.delete.useMutation(); // Use delete mutation

  const handleEdit = (id: string) => {
    router.push(`/employees/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee.mutateAsync(id);
        // Optionally, refetch or update local state to remove the deleted employee
        router.reload(); // Reload the page to reflect changes
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Actions</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Telephone</th>
              <th className="py-2 px-4 border-b">Email Address</th>
              <th className="py-2 px-4 border-b">Manager</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map(employee => (
                <tr key={employee.id}>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(employee.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">{employee.firstName}</td>
                  <td className="py-2 px-4 border-b">{employee.lastName}</td>
                  <td className="py-2 px-4 border-b">{employee.telephoneNumber}</td>
                  <td className="py-2 px-4 border-b">{employee.emailAddress}</td>
                  <td className="py-2 px-4 border-b">{employee.managerId}</td>
                  <td className="py-2 px-4 border-b">{employee.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-2 px-4 border-b text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 bg-gray-200 p-4">
        <p>Filter options go here</p>
      </div>
    </div>
  );
};

export default EmployeeList;
