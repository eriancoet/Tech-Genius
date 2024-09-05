import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';
import { HiFilter, HiSearch } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const EmployeeList: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Assert the type of session.user to include the role
  const user = session?.user as { id: string; email: string; role: string };
  const userRole = user?.role;

  const { data: employees, isLoading, refetch } = trpc.employee.getAll.useQuery();
  const updateEmployee = trpc.employee.update.useMutation();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');

  const handleEdit = (id: string) => {
    router.push(`/employees/${id}/edit`);
  };

  const handleDeactivate = async (id: string) => {
    if (userRole !== 'HR_ADMIN') {
      alert('You do not have permission to deactivate this employee.');
      return;
    }

    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      try {
        const employee = employees?.find(emp => emp.id === id);
        if (employee) {
          await updateEmployee.mutateAsync({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            telephoneNumber: employee.telephoneNumber,
            emailAddress: employee.emailAddress,
            managerId: employee.managerId ?? '', // Handle null values by providing an empty string fallback
            status: false, // Set status to inactive
          });
          refetch(); // Refetch the list of employees after deactivation
        }
      } catch (error) {
        console.error('Error deactivating employee:', error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  // Combine role-based and search/filter-based filtering logic
  const filteredEmployees = employees?.filter(employee => {
    // Role-based filtering
    if (userRole === 'EMPLOYEE') {
      return employee.emailAddress === session?.user?.email;
    }
    if (userRole === 'MANAGER') {
      return true; // Manager can see all employees
    }

    // Search and filter conditions for other roles
    const matchesSearch = search
      ? employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(search.toLowerCase()) ||
        employee.emailAddress.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && employee.status) ||
      (statusFilter === 'Deactive' && !employee.status);

    const matchesDepartment = departmentFilter === '' || employee.id === departmentFilter;
    const matchesManager = managerFilter === '' || employee.managerId === managerFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesManager;
  });

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Employees</h1>

        <div className="w-full max-w-3xl">
          <aside className="bg-gray-200 p-4 mb-4 border border-gray-300 rounded-md relative">
            <h2 className="text-lg font-semibold absolute -top-4 left-4 border-b border-gray-300 px-2">Filter</h2>

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
                <label htmlFor="department" className="w-32 font-medium">Department:</label>
                <select
                  id="department"
                  className="border border-gray-300 rounded-md w-4/5 md:w-3/4 text-xs"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Select</option>
                  {/* Add department options here */}
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
            {filteredEmployees && filteredEmployees.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">Actions</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">First Name</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">Last Name</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">Telephone</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">Email Address</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">Manager</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td className="py-2 px-4 border-b border-gray-300 flex space-x-2">
                        <button
                          onClick={() => handleEdit(employee.id)}
                          className="py-2 px-4 border-b border-gray-300 text-xs"
                        >
                          Edit
                        </button>
                        {userRole === 'HR_ADMIN' && (
                          <button
                            onClick={() => handleDeactivate(employee.id)}
                            className="py-2 px-4 border-b border-gray-300 text-xs"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{employee.firstName}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{employee.lastName}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{employee.telephoneNumber}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{employee.emailAddress}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{employee.managerId}</td>
                      <td className="py-2 px-4 border-b border-gray-300 text-xs">{employee.status ? 'Active' : 'Inactive'}</td>
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
