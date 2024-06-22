import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { handleAdminlogout } from "../../redux/reducers/admin/adminReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AdminLayout() {
  // const userAccess = JSON.parse(localStorage.getItem("authTokens"));
  // console.log("admin-useracess",userAccess);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    dispatch(handleAdminlogout())
      .then(() => {
        console.log("Logout successful");
        toast.success("Successfully logged out"); // Show success toast message
        navigate("/admin/adminlogin"); // Redirect to admin login page after signing out
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed"); // Show error toast message
      });
  };

  

  return (
    <div className="fixed">
    
      <script
        src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
        defer
      ></script>

      <div
        x-data="{ sidebarOpen: false }"
        className="flex h-screen bg-gray-200"
      >
        <div
          // className="sidebarOpen ? 'block' : 'hidden'"
          className="fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"
        ></div>

        <div
          // className="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
          className="fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0"
        >
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center">
              

              <span className="text-white text-2xl mx-2 font-semibold">
                Admin Dashboard
              </span>
            </div>
          </div>

          <nav className="mt-10">
            <Link to="dashboard" className="flex items-center mt-4 py-2 px-6 bg-gray-700 bg-opacity-25 text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>

              <span className="mx-3">Dashboard</span>
            </Link>

            <Link to="users" 
            className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
              </svg>

            
                <span className="mx-3">User Management</span>
           
            </Link>

            <Link to="agents" className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>

              
                <span className="mx-2">Agent Management</span>
          
            </Link>

            <Link to="destinationsList" className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>

        
                <span className="mx-3">Destination</span>
              
            </Link>

            <Link to="categories" className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>


                <span className="mx-3">Categories</span>
          
            </Link>
            <Link to="bookings" className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>

              
                <span className="mx-3">Bookings</span>
          
            </Link>
            {/* <Link to="notifications" className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
                <span className="mx-3">Notifications</span>
          
            </Link> */}
            <Link
              to="/login/admin" // Specify the route to redirect after logout
              onClick={handleLogout} // Dispatch logout action on click
              className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                {/* Add your logout icon/svg */}
              </svg>
              <span className="mx-3">LogOut</span>
            </Link>
          </nav>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
        
          <main className="flex-1 overflow-x-hidden overflow-y-auto z-10 bg-gray-200">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
