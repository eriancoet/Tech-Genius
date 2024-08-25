import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link'; // Import Link from next/link

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsOpen(prevState => !prevState);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <button
        onClick={toggleMenu}
        className="text-2xl"
      >
        {isOpen ? <HiX /> : <HiMenu />}
      </button>
      {isOpen && (
        <nav className="mt-4">
          <ul className="space-y-2">
            <li><Link href="/employees">Employees</Link></li>
            <li><Link href="/departments">Departments</Link></li>
            <li><Link href="/employees/create">Create Employee</Link></li>
            {session && (
              <li className="mt-4">
                <p className="text-sm">{session.user?.email}</p>
                <button
                  onClick={() => signOut()}
                  className="mt-2 text-red-400 hover:underline"
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
