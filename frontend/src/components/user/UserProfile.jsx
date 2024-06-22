import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleCancelBookings, handleChangePassword, handleFetchCustomerDetails, handleGetBookings } from '../../redux/reducers/user/userReducer';
import jwtDecode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleFetchingPackages } from '../../redux/reducers/tourpackage/packageReducer';
import CancellationModal from './Modal/CancellationModal';
import defaultImg from '../../assets/default_person.png'
import { instance } from '../../redux/api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { PAYMENT } from '../../constant';
import { FaSpinner } from 'react-icons/fa';

function UserProfile() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.user.loading);
  const access = useSelector((s) => s.user.authTokens?.access);
  const decoded = access ? jwtDecode(access) : null;
  const customer = useSelector((state) => state?.user?.userDetails);
  console.log("cust:", customer);
  const bookings = useSelector((state) => state?.user?.bookings);
  const packages = useSelector((state) => state.package?.packages);
  
  console.log("package::",packages)

  const [showPasswordChange, setShowPasswordChange] = useState(true); // Change default state to true
  const [showBookings, setShowBookings] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null); // State to track the selected booking for cancellation
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility


  useEffect(() => {
    if (decoded) {
      dispatch(handleFetchCustomerDetails(decoded?.id));
      dispatch(handleGetBookings(decoded?.id));
      dispatch(handleFetchingPackages())
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
      </div>
    );
  }

  const handlePasswordChangeClick = () => {
    setShowPasswordChange(true);
    setShowBookings(false);
  };


  const handlePasswordChange = async () => {
    try {
      const result = await dispatch(handleChangePassword({ id: decoded?.id, oldPassword, newPassword, confirmPassword }));

      if (result.payload.success) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Password changed successfully!');
      } else {
        toast.error(result.payload.error || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    }
  };


  const handleBookingsClick = () => {
    setShowBookings(true);
    setShowPasswordChange(false);
  };

  const handleCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleConfirmCancellation = async () => {
    if (selectedBookingId) {
      try {
        // Dispatch the cancellation and get bookings actions sequentially
        await dispatch(handleCancelBookings(selectedBookingId));
        await dispatch(handleGetBookings(decoded?.id));
        toast.success('Booking cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking. Please try again.');
      } finally {
        // Reset modal state
        setIsModalOpen(false);
        setSelectedBookingId(null);
      }
    }
  };
  
  
  

  // if (!customer) {
  //   return (
  //         <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
  //           <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
  //         </div>
  //   );
  // }

  return (
    <div className="flex ">
      <section className="text-gray-600 body-font w-1/3 ">
        <div className="container px-5 py-24 flex flex-col ">
          <div className="lg:w-4/6 mx-auto ">
            <div className="flex flex-col sm:flex-row mt-10 ">
              <div className="sm:w-full text-center sm:pr-8 sm:py-8">
                <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={defaultImg}
                    alt="userphoto"
                  />
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                    {customer?.first_name} {customer?.last_name}
                  </h2>
                  <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                  <p>{customer?.phone}</p>
                  <p className="text-base">{customer?.email}</p>
                </div>
                <div className="m-10">
                <button className="m-1 bg-gray-800 text-white font-bold py-2 px-4 rounded" onClick={handlePasswordChangeClick}>
                  Change Password
                </button>
                <button className="m-1 bg-gray-800 text-white font-bold py-2 px-4 rounded" onClick={handleBookingsClick}>
                  See Bookings
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font w-2/3 border-l border-gray-200">
        {showPasswordChange && (
          <PasswordChangeComponent
            oldPassword={oldPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setOldPassword={setOldPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordChange={handlePasswordChange}
          />
        )}
        {showBookings && (
          <BookingsComponent
            bookings={bookings}
            packages={packages}
            isModalOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
            handleCancelBooking={handleCancelBooking}
            handleConfirmCancellation={handleConfirmCancellation}
          />
        )}
      </section>
      {/* <ToastContainer/> */}
    </div>
  );
}

function PasswordChangeComponent({ oldPassword, newPassword, confirmPassword, setOldPassword, setNewPassword, setConfirmPassword, handlePasswordChange }) {
  return (
    <div className="container px-5 py-24 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <div>
        <label className='m-3'>Old Password:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
      </div>
      <div>
        <label className='m-3'>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
      </div>
      <div>
        <label className='m-3'>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
      </div>
      <div>
        <button
          onClick={handlePasswordChange}
          className="bg-indigo-500 text-white px-6 py-2 rounded-md"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

function BookingsComponent({ bookings, packages, isModalOpen, handleCloseModal, handleCancelBooking, handleConfirmCancellation }) {
  const dispatch = useDispatch();
  const access = useSelector((s) => s.user.authTokens?.access);
  const stripePromise = loadStripe('pk_test_51PATmXSHqu7cpmoL1XOnkQ3o6uYFh3qzxGqzVIJWrS9KIUuOGRngAoKbgG7TDvxoju0EwN9pYYpmQK5xbdw87oUi001cnpivCD');


  const handlePayment = async (bookingId) => {
    console.log('handlepaymentfunction')
    try {
      const response = await instance.post(
        PAYMENT,
        { bookingId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
  
      const sessionId = response.data.sessionId;
      console.log("session:", sessionId);
  
      if (sessionId) {
        console.log("Session ID:", sessionId);
        const stripe = await stripePromise;
  
        // Listen for the redirectToCheckoutCompleted event
        stripe.redirectToCheckout({
          sessionId: sessionId,
        }).then(function (result) {
          if (result.error) {
            console.error("Error redirecting to checkout:", result.error);
            // Handle error appropriately
          } else {
            // Call sendInvoiceEmail function after successful redirect
            try {
              sendInvoiceEmail(bookingId, access); // Pass the access token as an argument
              console.log('Invoice email sent successfully');
            } catch (error) {
              console.error('Error sending invoice email:', error);
            }
          }
        });
      } else {
        console.error("Invalid session data:", sessionId);
        // Handle invalid session data
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      // Handle error appropriately
    }
  }
  const handleOpenInvoice = (bookingId) => {
    window.open(`/invoice?bookingId=${bookingId}`, '_blank');
  };

  const sendInvoiceEmail = async (bookingId, access) => {
    console.log('sendInvoiceEmail function called with bookingId:', bookingId);
    // ... rest of the function
  
    try {
      const response = await instance.post(
        'api/customer/send-invoice-email/',
        { bookingId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`, // Use the access token here
          },
        }
      );
      console.log('Invoice email sent:', response.data);
    } catch (error) {
      console.error('Error sending invoice email:', error);
    }
  };


  return (
    <div className="container px-5 py-24 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      {!bookings || bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => {
            const packageObj = packages.find((pkg) => pkg.id === booking.package);
            const packageName = packageObj ? packageObj.package_name : "N/A";

            return (
              <li key={booking.id} className="border border-gray-300 rounded-md p-4 mb-4">
                <h3 className="text-lg font-semibold">{packageName}</h3>
                <p>Booking Date: {new Date(booking.booking_date).toLocaleString()}</p>
                <p>Travelers: {booking.num_travelers}</p>
                <p>Total Cost: {booking.total_cost}</p>
                <p>Paid: {booking.is_paid ? 'Yes' : 'No'}</p>
                <p>Status: {booking.status}</p>
                {/* Cancel Booking Button */}
                {booking.status === 'pending' && (
                  <button onClick={() => handleCancelBooking(booking.id)} className="bg-red-500 text-white px-4 py-2 rounded-md mt-2">Cancel</button>
                )}
                {/* Payment Button */}
                {booking.status === 'approved' && !booking.is_paid && (
                  <button onClick={() => handlePayment(booking.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                    Make Payment
                  </button>
                )}
                {/* Link to Open Invoice */}
                {booking.status === 'approved' && booking.is_paid && (
                  <button onClick={() => handleOpenInvoice(booking.id)} className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">
                    Open Invoice
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {/* Render the CancellationModal */}
      <CancellationModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onConfirm={handleConfirmCancellation}
          />
    </div>
  );
}



export default UserProfile;
