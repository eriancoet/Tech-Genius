import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';
import { HiFilter, HiSearch } from 'react-icons/hi'; // Import filter and search icons from react-icons

const EmployeeList: NextPage = () => {
  const { data: employees, isLoading } = trpc.employee.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="flex flex-col items-start p-4">
        {/* Heading for Employees */}
        <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Employees</h1>

        <div className="w-full max-w-3xl">
          {/* Filter Section */}
          <aside className="bg-gray-200 p-4 mb-4 border border-gray-300 rounded-md relative">
            {/* Heading with no background, positioned on top of the border aligned horizontally to the left */}
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
                  style={{ width: '60%', paddingLeft: '40px', paddingRight: '40px' }}
                >
                  <option>Active</option>
                  <option>All</option>
                  <option>Deactive Only</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="department" className="w-32 font-medium">Department:</label>
                <select
                  id="department"
                  className="border border-gray-300 rounded-md"
                  style={{ width: '60%', paddingLeft: '40px', paddingRight: '40px' }}
                >
                  <option>Select</option>
                  {/* Add department options here */}
                </select>
              </div>

              {/* Manager Filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="manager" className="w-32 font-medium">Manager:</label>
                <select
                  id="manager"
                  className="border border-gray-300 rounded-md"
                  style={{ width: '60%', paddingLeft: '40px', paddingRight: '40px' }}
                >
                  <option>Select</option>
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
              />
            </div>
          </div>

          {/* Employee List */}
          <div className="overflow-x-auto">
            {employees && employees.length > 0 ? (
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
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {/* Add action buttons or links here */}
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
