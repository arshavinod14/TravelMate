import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  handleCustomerLogout,
  handleFetchCustomerDetails,
} from "../../redux/reducers/user/userReducer";
import jwtDecode from "jwt-decode";
import defaultImg from '../../assets/default_person.png';
import NotificationComponent from "../../pages/NotificationList";
import { useMediaQuery } from 'react-responsive';
import { FaSpinner } from "react-icons/fa";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const loading = useSelector((s) => s.user.loading);
  const access = useSelector((s) => s.user.authTokens?.access);
  const decoded = access ? jwtDecode(access) : null;
  console.log("access", decoded);
  const menuRef = useRef(null);
  const userDetails = useSelector((s) => s.user.userDetails);
  const [isVisible, setIsVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    if (decoded) {
      dispatch(handleFetchCustomerDetails(decoded?.id));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isVisible
      ) {
        setIsVisible(false);
      }
      if (
        showHamburgerMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowHamburgerMenu(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, showHamburgerMenu]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && showHamburgerMenu) {
        setShowHamburgerMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showHamburgerMenu]);
  

  const handleLogout = () => {
    dispatch(handleCustomerLogout()).then(() => {
      navigate("/");
      toast.success('Successfully logged out!');
    });
    handleToggle(); // Close the menu
  };

  const handleIconClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const toggleHamburgerMenu = () => {
    setShowHamburgerMenu(!showHamburgerMenu);
  };

  const handleMenuLinkClick = () => {
    setShowHamburgerMenu(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            TravelMate.
          </span>
        </Link>

        {!showHamburgerMenu && (
          <div className="relative flex items-center md:order-2 mr-2">
            {!access ? (
              <Link to="/login">
                <span className="text-1xl text-blue-600">Login</span>
              </Link>
            ) : (
              <>
                {!isSmallScreen && (
                  <>
                    {/* <div className="relative" onClick={handleIconClick}>
                      <div className="absolute left-0 top-0 bg-red-500 rounded-full">
                        <span className="text-sm text-white p-1">12</span>
                      </div>
                      <div className="p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="27" height="27" viewBox="0 0 50 50">
  <path fill="#ffffff" d="M 25 0 C 22.800781 0 21 1.800781 21 4 C 21 4.515625 21.101563 5.015625 21.28125 5.46875 C 15.65625 6.929688 12 11.816406 12 18 C 12 25.832031 10.078125 29.398438 8.25 31.40625 C 7.335938 32.410156 6.433594 33.019531 5.65625 33.59375 C 5.265625 33.878906 4.910156 34.164063 4.59375 34.53125 C 4.277344 34.898438 4 35.421875 4 36 C 4 37.375 4.84375 38.542969 6.03125 39.3125 C 7.21875 40.082031 8.777344 40.578125 10.65625 40.96875 C 13.09375 41.472656 16.101563 41.738281 19.40625 41.875 C 19.15625 42.539063 19 43.253906 19 44 C 19 47.300781 21.699219 50 25 50 C 28.300781 50 31 47.300781 31 44 C 31 43.25 30.847656 42.535156 30.59375 41.875 C 33.898438 41.738281 36.90625 41.472656 39.34375 40.96875 C 41.222656 40.578125 42.78125 40.082031 43.96875 39.3125 C 45.15625 38.542969 46 37.375 46 36 C 46 35.421875 45.722656 34.898438 45.40625 34.53125 C 45.089844 34.164063 44.734375 33.878906 44.34375 33.59375 C 43.566406 33.019531 42.664063 32.410156 41.75 31.40625 C 39.921875 29.398438 38 25.832031 38 18 C 38 11.820313 34.335938 6.9375 28.71875 5.46875 C 28.898438 5.015625 29 4.515625 29 4 C 29 1.800781 27.199219 0 25 0 Z M 25 2 C 26.117188 2 27 2.882813 27 4 C 27 5.117188 26.117188 6 25 6 C 23.882813 6 23 5.117188 23 4 C 23 2.882813 23.882813 2 25 2 Z M 27.34375 7.1875 C 32.675781 8.136719 36 12.257813 36 18 C 36 26.167969 38.078125 30.363281 40.25 32.75 C 41.335938 33.941406 42.433594 34.6875 43.15625 35.21875 C 43.515625 35.484375 43.785156 35.707031 43.90625 35.84375 C 44.027344 35.980469 44 35.96875 44 36 C 44 36.625 43.710938 37.082031 42.875 37.625 C 42.039063 38.167969 40.679688 38.671875 38.9375 39.03125 C 35.453125 39.753906 30.492188 40 25 40 C 19.507813 40 14.546875 39.753906 11.0625 39.03125 C 9.320313 38.671875 7.960938 38.167969 7.125 37.625 C 6.289063 37.082031 6 36.625 6 36 C 6 35.96875 5.972656 35.980469 6.09375 35.84375 C 6.214844 35.707031 6.484375 35.484375 6.84375 35.21875 C 7.566406 34.6875 8.664063 33.941406 9.75 32.75 C 11.921875 30.363281 14 26.167969 14 18 C 14 12.261719 17.328125 8.171875 22.65625 7.21875 C 23.320313 7.707031 24.121094 8 25 8 C 25.886719 8 26.679688 7.683594 27.34375 7.1875 Z M 21.5625 41.9375 C 22.683594 41.960938 23.824219 42 25 42 C 26.175781 42 27.316406 41.960938 28.4375 41.9375 C 28.792969 42.539063 29 43.25 29 44 C 29 46.222656 27.222656 48 25 48 C 22.777344 48 21 46.222656 21 44 C 21 43.242188 21.199219 42.539063 21.5625 41.9375 Z"></path>
</svg>
                      </div>
                    </div> */}
                    <button
                      type="button"
                      className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      id="user-menu-button"
                      aria-expanded={isVisible ? "true" : "false"}
                      onClick={handleToggle}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src={defaultImg}
                        alt="user_icon"
                      />
                    </button>
                  </>
                )}
                {/* {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-md">
                    <NotificationComponent onClose={handleCloseNotifications} />
                  </div>
                )} */}
                {isVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 z-10 mt-2 top-8 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        {userDetails?.first_name} {userDetails?.last_name}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {userDetails?.email}
                      </span>
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <Link
                          to="/profile"
                          onClick={handleToggle}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Sign out
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
            <button
              data-collapse-toggle="navbar-hamburger"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-hamburger"
              aria-expanded={showHamburgerMenu ? "true" : "false"}
              onClick={toggleHamburgerMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        <div
          className={`${
            showHamburgerMenu ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-menu"
          ref={menuRef}
        >
          
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:font-medium">
      
            <li>
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
                onClick={handleMenuLinkClick}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={handleMenuLinkClick}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/listOfPackage"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={handleMenuLinkClick}
              >
                Packages
              </Link>
            </li>
            <li>
              <Link
                to="/destinations-page"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={handleMenuLinkClick}
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={handleMenuLinkClick}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
     
    </>
  );
};
