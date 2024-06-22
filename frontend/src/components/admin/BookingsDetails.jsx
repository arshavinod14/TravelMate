import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAgents, handleFetchBookings, handleFetchingUsers } from '../../redux/reducers/admin/adminReducer';
import { handleFetchingPackages } from '../../redux/reducers/tourpackage/packageReducer';
import { FaSpinner } from 'react-icons/fa';

function BookingsDetails() {
    const dispatch = useDispatch();
    const bookings = useSelector((state) => state.admin.booking);
    const loading = useSelector((state) => state.admin?.loading);
    const error = useSelector((state) => state.admin?.error);
    const packages = useSelector((state) => state.package?.packages);
    const users = useSelector((state) => state.admin?.users);
    const agents = useSelector(s => s.admin?.agents);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(()=>{
        dispatch(handleFetchBookings());
        dispatch(handleFetchingPackages());
        dispatch(handleFetchingUsers());
        dispatch(handleFetchAgents());
    },[dispatch]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredBookings = bookings.bookings?.filter((booking) => {
        const packageObj = packages.find((pkg) => pkg.id === booking.package);
        const packageName = packageObj ? packageObj.package_name : "N/A";
        const customerObj = users?.user?.find((user) => user.id === booking.user);
        const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";
        const agentObj = agents?.agent?.find((agent) => agent.id === packageObj?.agent_id);
        const agentName = agentObj ? `${agentObj.first_name} ${agentObj.last_name}` : "N/A";

        return (
            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agentName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings?.slice(indexOfFirstItem, indexOfLastItem);

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
                    onChange={handleSearch}
                />
            </header>

            {currentItems && currentItems.length > 0 && (
                <div className='mt-10 mr-60'>
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    User Name
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Package
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Agent Name
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Booked Date and Time
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((booking) => {
                                const packageObj = packages.find((pkg) => pkg.id === booking.package);
                                const packageName = packageObj ? packageObj.package_name : "N/A";
                                const customerObj = users?.user?.find((user) => user.id === booking.user);
                                const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";
                                const agentObj = agents?.agent?.find((agent) => agent.id === packageObj?.agent_id);
                                const agentName = agentObj ? `${agentObj.first_name} ${agentObj.last_name}` : "N/A";

                                return (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4">{customerName}</td>
                                        <td className="px-6 py-4">{packageName}</td>
                                        <td className="px-6 py-4">{agentName}</td>
                                        <td className="px-6 py-4">{new Date(booking.booking_date).toLocaleString()}</td>
                                        <td className="px-6 py-4">{booking.total_cost}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4 mb-2">
                {Array.from({ length: Math.ceil(filteredBookings.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BookingsDetails;
