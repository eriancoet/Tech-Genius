import React from 'react';
import Link from 'next/link';

// Define the interface for props
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
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
          <li>
            <Link href="../pages/employees/create.tsx">
              <span className="text-blue-400 hover:underline text-sm">Create Employee</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
