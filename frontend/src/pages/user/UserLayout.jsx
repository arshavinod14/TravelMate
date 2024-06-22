import React from 'react';
import { Navbar } from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import { Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gray-900 bg-opacity-60 p-3 w-full fixed z-10">
        <Navbar />
      </div>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
