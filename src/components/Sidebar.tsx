import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // Import useSession to get user details

// Define the interface for props
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { data: session } = useSession(); // Get the user session

  // Extract the user role from the session (assumes role is stored in session.user.role)
  const userRole = session?.user?.role;

  return (
    <aside className={`w-[250px] h-[400px] bg-gray-700 text-white p-4 ${className}`}>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/employees">
              <span className="text-sm">Employees</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/departments">
              <span className="text-sm">Departments</span>
            </Link>
          </li>
          {/* Conditionally render "Create Employee" based on user role */}
          {userRole === 'HR_ADMIN' && (
            <li className="mb-2">
              <Link href="/employees/create">
                <span className="text-sm">Create Employee</span>
              </Link>
            </li>
          )}
          <li>
             {/* Conditionally render "Create Employee" based on user role */}
          {userRole === 'HR_ADMIN' && (
            <Link href="/departments/create">
              <span className="text-sm">Create Department</span>
            </Link>
             )}
          </li>
       
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
