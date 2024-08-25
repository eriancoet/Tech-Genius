import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <li><a href="/employees">Employees</a></li>
            <li><a href="/departments">Departments</a></li>
            <li><a href="/employees/create" className="text-blue-400 hover:underline">Create Employee</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
