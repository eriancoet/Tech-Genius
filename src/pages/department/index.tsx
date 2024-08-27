import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';
import { HiFilter, HiSearch } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { useState } from 'react';

const DepartmentList: NextPage = () => {
  const router = useRouter();
  const { data: departments, isLoading, refetch } = trpc.department.getAll.useQuery();
  const updateDepartment = trpc.department.update.useMutation(); // Use update mutation for deactivation

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('');

  const handleEdit = (id: string) => {
    router.push(`/departments/${id}/edit`);
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this department?')) {
      try {
        const department = departments?.find(dep => dep.id === id);
        if (department) {
          await updateDepartment.mutateAsync({
            id: department.id,
            name: department.name,
            status: false, // Set status to inactive
            managerId: department.managerId,
          });
          refetch(); // Refetch the list of departments after deactivation
        }
      } catch (error) {
        console.error('Error deactivating department:', error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const filteredDepartments = departments?.filter(department => {
    return (
      (statusFilter === 'All' || (statusFilter === 'Active' && department.status) || (statusFilter === 'Deactive' && !department.status)) &&
      (managerFilter === '' || department.managerId === managerFilter) &&
      (department.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Departments</h1>

        <div className="w-full max-w-3xl">
          <aside className="bg-gray-200 p-4 mb-4 border border-gray-300 rounded-md relative">
            <h2 className="text-lg font-semibold absolute -top-4 left-4 border-b border-gray-300 px-2">
              Filter
            </h2>

            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-2">
                <label htmlFor="status" className="w-32 font-medium">Status:</label>
                <select
                  id="status"
                  className="border border-gray-300 rounded-md w-4/5 md:w-3/4 text-xs"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive Only</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="manager" className="w-32 font-medium">Manager:</label>
                <select
                  id="manager"
                  className="border border-gray-300 rounded-md w-4/5 md:w-3/4 text-xs"
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                >
                  <option value="">Select</option>
                  {/* Add manager options here */}
                </select>
              </div>
            </div>

            <div className="mt-8 flex items-center space-x-2">
              <button className="p-2 text-gray-800 border border-gray-800 rounded-full flex items-center justify-center">
                <HiFilter className="text-xl" />
              </button>
              <span className="ml-2 text-lg font-semibold">Filter</span>
            </div>
          </aside>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Show per Page:</span>
              <select className="border border-gray-300 rounded-md p-2 text-xs" style={{ width: 'auto' }}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
                <option>All</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <HiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                style={{ width: '90px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredDepartments && filteredDepartments.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 text-xs">Actions</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-xs">Name</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-xs">Manager</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-xs">Status</th>
                </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map(department => (
                    <tr key={department.id}>
                      <td className="py-2 px-4 border-b border-gray-300 flex space-x-2">
                        <button
                          onClick={() => handleEdit(department.id)}
                          className="py-2 px-4 border-b border-gray-300 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(department.id)}
                          className="py-2 px-4 border-b border-gray-300 text-xs"
                        >
                          Deactivate
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{department.name}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{department.managerId}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{department.status ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No departments available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DepartmentList;
