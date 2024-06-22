import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleApproveBooking, handleDeclineBooking, handleGetBookings } from '../../redux/reducers/agent/agentReducer';
import jwt_decode from "jwt-decode";
import { handleFetchingPackages } from '../../redux/reducers/tourpackage/packageReducer';
import { handleFetchingUsers } from '../../redux/reducers/admin/adminReducer';
import Modal from './Modal/ViewBooking/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const dispatch = useDispatch();
  const agentBookings = useSelector((state) => state.agent?.bookings);
  const loading = useSelector((state) => state.agent?.loading);
  const packages = useSelector((state) => state.package?.packages);
  const users = useSelector((state) => state.admin?.users);

  const getAgentIdFromToken = () => {
    try {
      const tokenJSON = localStorage.getItem("agentTokens");
      const tokenObject = JSON.parse(tokenJSON);
      const accessToken = tokenObject.access;
      const decodedToken = jwt_decode(accessToken);
      const agentId = decodedToken.id;
      return agentId;
    } catch (error) {
      console.error("Error retrieving agent ID from token:", error);
      return null;
    }
  };

  const agentId = getAgentIdFromToken();

  useEffect(() => {
    if (agentId) {
      dispatch(handleGetBookings(agentId));
    }
    dispatch(handleFetchingPackages());
    dispatch(handleFetchingUsers());
  }, [agentId, dispatch]);

  useEffect(() => {
    if (agentBookings && agentBookings.length > 0) {
      setBookings(agentBookings);
    }
  }, [agentBookings]);

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  const filteredPackages = sortedBookings.filter((booking) => {
    const packageObj = packages.find((pkg) => pkg.id === booking.package);
    const packageName = packageObj ? packageObj.package_name : "N/A";
    const customerObj = users?.user?.find((user) => user.id === booking.user);
    const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";
    const paidStatus = booking.is_paid ? 'yes' : 'no';
    const actionStatus = booking.status === 'pending' ? 'Pending' : booking.status;

    return (
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.total_cost.toString().includes(searchQuery.toLowerCase()) ||
      paidStatus === searchQuery.toLowerCase() ||
      actionStatus.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredPackages.slice(indexOfFirstBooking, indexOfLastBooking);

  const handleOpenModal = (bookingId, action) => {
    setSelectedBookingId(bookingId);
    setModalAction(action);
    setShowModal(true);
  };

  const handleApproveBookingModal = () => {
    dispatch(handleApproveBooking({ agentId, bookingId: selectedBookingId }))
      .then(() => {
        dispatch(handleGetBookings(agentId));
        setShowModal(false);
        toast.success('Booking approved successfully');
      })
      .catch((error) => {
        console.error('Error approving booking:', error);
        toast.error('Failed to approve booking. Please try again.');
      });
  };

  const handleDeclineBookingModal = () => {
    dispatch(handleDeclineBooking({ agentId, bookingId: selectedBookingId }))
      .then(() => {
        dispatch(handleGetBookings(agentId));
        setShowModal(false);
        toast.success('Booking declined successfully');
      })
      .catch((error) => {
        console.error('Error declining booking:', error);
        toast.error('Failed to decline booking. Please try again.');
      });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-gray-800 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white border-b-4 border-indigo-600 w-screen">
        <input
          className="w-full py-4 px-6 rounded-md pl-2 outline-none focus:outline-none active:outline-none"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>
      <div className="mt-16 mr-60">
        {(!bookings || bookings.length === 0) ? (
          <p>No bookings found.</p>
        ) : (
          <>
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Package Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Booked Date
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Number Of Travelers
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Total Amount
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Paid
                  </th>
                  <th></th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => {
                  const packageObj = packages.find((pkg) => pkg.id === booking.package);
                  const packageName = packageObj ? packageObj.package_name : "N/A";
                  const customerObj = users?.user?.find((user) => user.id === booking.user);
                  const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";

                  return (
                    <tr key={booking.id}>
                      <td className="px-6 py-4">{customerName}</td>
                      <td className="px-6 py-4">{packageName}</td>
                      <td className="px-6 py-4">{new Date(booking.booking_date).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">{booking.num_travelers}</td>
                      <td className="px-6 py-4">{booking.total_cost}</td>
                      <td className="px-6 py-4">{booking.is_paid ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4">
                        {booking.status === 'pending' && (
                          <button
                            type="button"
                            className="text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                            onClick={() => handleOpenModal(booking.id, 'approve')}
                          >
                            Pending
                          </button>
                        )}
                        {booking.status !== 'pending' && booking.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 mb-2">
              {Array.from({ length: Math.ceil(filteredPackages.length / bookingsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onApprove={handleApproveBookingModal}
        onDecline={handleDeclineBookingModal}
        action={modalAction}
      />

      <ToastContainer />
    </div>
  );
}

export default BookingsTable;
