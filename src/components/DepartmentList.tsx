import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc'; // Ensure this points to the correct path

interface Department {
  id: string; // Change to string
  name: string;
  managerId: string;
  managerName?: string; // Assuming there's a managerName field
  status: boolean;
}

interface DepartmentListProps {
  departments: Department[];
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments }) => {
  const router = useRouter();
  const deactivateDepartment = trpc.department.update.useMutation();

  const handleEdit = (id: string) => { // Change to string
    router.push(`/departments/${id}/edit`);
  };

  const handleDeactivate = async (id: string) => { // Change to string
    if (window.confirm('Are you sure you want to deactivate this department?')) {
      try {
        const department = departments.find(dep => dep.id === id);
        if (department) {
          await deactivateDepartment.mutateAsync({
            id: department.id,
            name: department.name,
            managerId: department.managerId,
            status: false,
          });
          router.reload();
        }
      } catch (error) {
        console.error('Failed to deactivate department:', error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '15%', fontSize: '0.875rem' }}>Actions</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '35%', fontSize: '0.875rem' }}>Name</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '30%', fontSize: '0.875rem' }}>Manager</th>
              <th className="py-2 px-4 border-b text-xs" style={{ width: '20%', fontSize: '0.875rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((department) => (
                <tr key={department.id}>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(department.id)}
                      className="text-blue-500 hover:underline text-xs px-2 py-1 rounded border border-blue-500"
                    >
                      Edit
                    </button>
                    {department.status && (
                      <button
                        onClick={() => handleDeactivate(department.id)}
                        className="text-red-500 hover:underline text-xs px-2 py-1 rounded border border-red-500"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-xs">{department.name}</td>
                  <td className="py-2 px-4 border-b text-xs">{department.managerName || 'No Manager'}</td>
                  <td className="py-2 px-4 border-b text-xs">{department.status ? 'Active' : 'Inactive'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 border-b text-center text-xs">
                  No departments found.
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

export default DepartmentList;
