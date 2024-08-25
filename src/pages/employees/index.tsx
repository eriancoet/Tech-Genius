import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/Layout';

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
          <aside className="bg-gray-200 p-4 mb-4 border border-gray-300 rounded-md">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">Filter</h2>
            {/* Add filter options here */}
            <div className="space-y-2">
              {/* Example Filter Items */}
              <div className="border border-gray-300 p-2 rounded-md">
                <p>Filter Option 1</p>
              </div>
              <div className="border border-gray-300 p-2 rounded-md">
                <p>Filter Option 2</p>
              </div>
              {/* Add more filter items as needed */}
            </div>
          </aside>

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
