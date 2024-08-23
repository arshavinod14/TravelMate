import React, { useState, useEffect } from 'react';
import AddDestinationModal from './Modal/DestinationModal/AddDestination';
import EditDestinationModal from './Modal/DestinationModal/EditDestination';
import DeleteDestinationModal from './Modal/DestinationModal/DeleteDestination';
import { useDispatch, useSelector } from 'react-redux'; 
import { handleAddDestination, handleDeleteDestination, handleEditDestination, handleFetchingDestination } from '../../redux/reducers/destination/destinationReducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';

const DestinationTable = () => {
  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destination?.destinations);
  const loading = useSelector((state) => state.destination.loading);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [destinationId, setDestinationId] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destinationIdToDelete, setDestinationIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    dispatch(handleFetchingDestination());
  }, []);

  const filteredDestinations = destinations.filter((destination) =>
    Object.values(destination)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
};
  

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (destination) => {
    setIsEditModalOpen(true);
    setDestinationId(destination.id);
    setDestination(destination);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setDestinationId(null);
    setDestination(null);
  };

  const handleOpenDeleteModal = (destination) => {
    setIsDeleteModalOpen(true);
    setDestinationIdToDelete(destination.id);
    setDestination(destination);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDestinationIdToDelete(null);
  };

  const handleAddSubmit = async (formData) => {
    try {
      await dispatch(handleAddDestination(formData));
      handleCloseAddModal();
      toast.success('Destination added successfully');
    } catch (error) {
      console.error('Error adding destination:', error);
      toast.error('Failed to add destination. Please try again.');
    }
  };
  
  const handleEditSubmit = async (formData) => {
    try {
      await dispatch(handleEditDestination({ id: destination.id, formData }));
      handleCloseEditModal();
      toast.success('Destination edited successfully');
    } catch (error) {
      console.error('Error editing destination:', error);
      toast.error('Failed to edit destination. Please try again.');
    }
  };
  
  const handleDeleteSubmit = async () => {
    if (destinationIdToDelete) {
      try {
        await dispatch(handleDeleteDestination(destinationIdToDelete));
        handleCloseDeleteModal();
        dispatch(handleFetchingDestination());
        toast.success('Destination deleted successfully');
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Failed to delete destination. Please try again.');
      }
    }
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
      <header className=" border-b-4 border-indigo-600 w-screen">
        <input
          className="w-full py-4 px-6 rounded-md pl-2 outline-none focus:outline-none active:outline-none"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </header>
      
      <button
        type="button"
        className="text-white bg-violet-500 hover:bg-violet-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 ml-2 mb-4 mt-4"
        onClick={handleOpenAddModal}
      >
        Add Destination
      </button>

      {isAddModalOpen && (
        <AddDestinationModal
          isOpen={isAddModalOpen}
          onSubmit={handleAddSubmit}
          onClose={handleCloseAddModal}
        />
      )}

      {isEditModalOpen && (
        <EditDestinationModal
          isOpen={isEditModalOpen}
          destination={destination}
          onSubmit={handleEditSubmit}
          onClose={handleCloseEditModal}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteDestinationModal
          isOpen={isDeleteModalOpen}
          destination={destination}
          destinationIdToDelete={destinationIdToDelete}
          onConfirm={handleDeleteSubmit}
          onClose={handleCloseDeleteModal}
        />
      )}

      <div className='mr-60'>
        {loading && <p>Loading...</p>}
        {currentItems.length === 0 && !loading && <p>No destinations found</p>}
        {currentItems.length > 0 && (
          <table className="w-full border-collapse  bg-white text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                  Destination Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                  Description
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Image
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                  Actions
                </th>
                </tr>
            </thead>
            <tbody>
              {currentItems.map((destination) => (
                <tr key={destination.id}>
                  <td className="px-6 py-4 text-center">{destination.destination_name}</td>
                  <td className="px-6 py-4 text-center break-all">{destination.description}</td>
                  <td className="px-6 py-4">
                    {destination.image && (
                      <img  
                        src={`http://127.0.0.1:8000${destination.image}`}
                        alt={destination.destination_name} 
                        className="w-40 h-28 rounded-lg" />
                    )}
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button
                      type="button"
                      className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                      onClick={() => handleOpenEditModal(destination)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                      onClick={() => handleOpenDeleteModal(destination)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-4 mb-2">
  {Array.from({ length: Math.ceil(destinations.length / itemsPerPage) }, (_, i) => (
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

    </div>
  );
}

export default DestinationTable;
