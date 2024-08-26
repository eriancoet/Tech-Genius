import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Link from 'next/link'; // Ensure you import Link for navigation
import { useSession, signOut } from 'next-auth/react'; // Import necessary hooks

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); // Access session data

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
      <h1 className="text-xl font-bold flex-grow text-left">HR Administration System</h1>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span>{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-blue-400 hover:underline"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="text-blue-400 hover:underline">Sign In
          </Link>
        )}
      </div>
      {isOpen && (
        <nav className="mt-4 absolute right-0 top-full bg-gray-800 text-white p-4 rounded-md shadow-lg">
          <ul className="space-y-2">
            <li><Link href="/employees">Employees</Link></li>
            <li><Link href="/departments">Departments</Link></li>
            <li><Link href="/employees/create" className="text-blue-400 hover:underline">Create Employee</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
