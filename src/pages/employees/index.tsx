import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';
import { HiFilter, HiSearch } from 'react-icons/hi'; // Import filter and search icons from react-icons
import { useRouter } from 'next/router';
import { useState } from 'react';

const EmployeeList: NextPage = () => {
  const router = useRouter();
  const { data: employees, isLoading, refetch } = trpc.employee.getAll.useQuery();
  const deleteEmployee = trpc.employee.delete.useMutation();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');

  const handleEdit = (id: string) => {
    router.push(`/employees/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee.mutateAsync(id);
        refetch(); // Refetch the list of employees after deletion
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const filteredEmployees = employees?.filter(employee => {
    return (
      (statusFilter === 'All' || employee.status === statusFilter) &&
      (departmentFilter === '' || employee.department === departmentFilter) &&
      (managerFilter === '' || employee.managerId === managerFilter) &&
      (employee.firstName.toLowerCase().includes(search.toLowerCase()) || 
       employee.lastName.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        {/* Heading for Employees */}
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Employees</h1>

        <div className="w-full max-w-3xl">
          {/* Filter Section */}
          <aside className="bg-gray-200 p-4 mb-4 border border-gray-300 rounded-md relative">
            <h2 className="text-lg font-semibold absolute -top-4 left-4 border-b border-gray-300 px-2">
              Filter
            </h2>

            {/* Filter Options */}
            <div className="space-y-4 mt-8">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="status" className="w-32 font-medium">Status:</label>
                <select
                  id="status"
                  className="border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive Only</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="department" className="w-32 font-medium">Department:</label>
                <select
                  id="department"
                  className="border border-gray-300 rounded-md"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Select</option>
                  {/* Add department options here */}
                </select>
              </div>

              {/* Manager Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="manager" className="w-32 font-medium">Manager:</label>
                <select
                  id="manager"
                  className="border border-gray-300 rounded-md"
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                >
                  <option value="">Select</option>
                  {/* Add manager options here */}
                </select>
              </div>
            </div>

            {/* Filter Button with Text */}
            <div className="mt-8 flex items-center space-x-2">
              <button className="p-2 bg-gray-800 text-white rounded-full flex items-center justify-center">
                <HiFilter className="text-xl" />
              </button>
              <span className="ml-2 text-lg font-semibold">Filter</span>
            </div>
          </aside>

          {/* Show Per Page and Search Section */}
          <div className="flex items-center justify-between mb-4">
            {/* Show Per Page Dropdown */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Show per Page:</span>
              <select className="border border-gray-300 rounded-md p-2" style={{ width: 'auto' }}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
                <option>All</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center space-x-2">
              <HiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="border border-gray-300 rounded-md px-2 py-1"
                style={{ width: '90px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Employee List */}
          <div className="overflow-x-auto">
            {filteredEmployees && filteredEmployees.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300">Actions</th>
                    <th className="py-2 px-4 border-b border-gray-300">First Name</th>
                    <th className="py-2 px-4 border-b border-gray-300">Last Name</th>
                    <th className="py-2 px-4 border-b border-gray-300">Telephone</th>
                    <th className="py-2 px-4 border-b border-gray-300">Email Address</th>
                    <th className="py-2 px-4 border-b border-gray-300">Manager</th>
                    <th className="py-2 px-4 border-b border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td className="py-2 px-4 border-b border-gray-300 flex space-x-2">
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
                      <td className="py-2 px-4 border-b border-gray-300">{employee.firstName}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{employee.lastName}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{employee.telephoneNumber}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{employee.emailAddress}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{employee.managerId}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{employee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No employees available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeList;
