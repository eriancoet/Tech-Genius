// src/components/Layout.tsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar className="w-64" />
        <main className="flex flex-col flex-grow p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
