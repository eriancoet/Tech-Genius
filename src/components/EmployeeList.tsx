// src/components/EmployeeList.tsx
import React from 'react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  telephoneNumber: string;
  emailAddress: string;
  status: string;
  managerId: string; // Include managerId in the interface
}

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
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
                  <td className="py-2 px-4 border-b">
                    {/* Add action buttons or links here */}
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
