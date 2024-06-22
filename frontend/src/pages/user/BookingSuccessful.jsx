import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { handleFetchingPackages } from '../../redux/reducers/tourpackage/packageReducer';
import { handleFetchingUsers } from '../../redux/reducers/admin/adminReducer';

const AppointmentBookedSuccessfully = () => {
  const location = useLocation();
  const bookingData = location.state;
  const dispatch = useDispatch();
  const packages = useSelector((state) => state.package?.packages);
  const users = useSelector((state) => state.admin?.users);
  console.log("users", users);

  useEffect(() => {
    dispatch(handleFetchingPackages());
    dispatch(handleFetchingUsers());
  }, []);

  const { booking_date, package: packageId, user: userId } = bookingData.payload;
  const packageObj = packages.find((pkg) => pkg.id === packageId);
  const packageName = packageObj ? packageObj.package_name : "N/A";
  const customerObj = users?.user?.find((user) => user.id === userId);
  const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";
  const customerEmail = customerObj ? customerObj.email : "N/A";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-500 rounded-full p-2 mr-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold ">Booked Successfully!</h2>
        </div>
        <p className="text-gray-600 mb-6 text-center">Agent will contact you shortly.Thank You!</p>
        <div className="grid grid-cols-1 md:grid-cols-4 mb-6 pl-4">
          <div className="border-l-4 border-slate-300 ml-2 p-4">
            <h3 className="font-bold">Customer Name:</h3>
            <p>{customerName}</p>
          </div>
          <div className="border-l-4 border-slate-300 ml-2 p-4">
            <h3 className="font-bold">Customer Email:</h3>
            <p>{customerEmail}</p>
          </div>
          <div className="border-l-4 border-slate-300 ml-2 p-4">
            <h3 className="font-bold">Package:</h3>
            <p>{packageName}</p>
          </div>
          <div className="border-l-4 border-slate-300 ml-2 p-4">
            <h3 className="font-bold">Date &amp; Time:</h3>
            <p>{new Date(booking_date).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookedSuccessfully;