import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAddNewActivity,
  handleAddPackage,
  handleDeletePackage,
  handleEditPackage,
  handleFetchingPackages,
} from "../../redux/reducers/tourpackage/packageReducer";
import {
  handleAgentIdDetails,
  handleGetAgentPackages,
} from "../../redux/reducers/agent/agentReducer";
import jwt_decode from "jwt-decode";
import AddPackageModal from "./Modal/Package/AddPackage";
import { handleFetchCategory } from "../../redux/reducers/admin/adminReducer";
import AddPackageActivityModal from "./Modal/Activities/AddPackageActivity";
import EditPackageModal from "./Modal/Package/EditPackage";
import DeletePackageModal from "./Modal/Package/DeletePackage";
import ViewActivitiesModal from "./Modal/Activities/ViewActivities";
import { handleFetchingDestination } from "../../redux/reducers/destination/destinationReducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

function PackageTable() {
  const dispatch = useDispatch();
  const packages = useSelector((state) => state.agent?.packages);
  const loading = useSelector((state) => state.agent?.loading);
  const categories = useSelector((state) => state.admin?.category);
  const destinations = useSelector((state) => state.destination?.destinations);

  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage] = useState(5); // Change the number of packages per page as needed

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [isViewActivitiesModalOpen, setIsViewActivitiesModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getAgentIdFromToken = () => {
    try {
      const tokenJSON = localStorage.getItem("agentTokens");
      const tokenObject = JSON.parse(tokenJSON);
      const accessToken = tokenObject.access;
      const decodedToken = jwt_decode(accessToken);
      const agentId = decodedToken.id;
      return agentId;
    } catch (error) {
      return null;
    }
  };

  const agentId = getAgentIdFromToken();

  useEffect(() => {
    dispatch(handleGetAgentPackages(agentId));
    dispatch(handleAgentIdDetails(agentId));
    dispatch(handleFetchCategory());
    dispatch(handleFetchingDestination());
  }, [agentId]);

  const agentPackages = Array.isArray(packages)
    ? packages.map((pkg) => {
        const categoryId = pkg.category || null;
        const categoryObj = categories.find((cat) => cat.id === categoryId) || null;
        const categoryName = categoryObj ? categoryObj.name : null;

        const destinationId = pkg.destination_id || null;
        const destinationObj = destinations.find((dest) => dest.id === destinationId) || null;
        const destinationName = destinationObj ? destinationObj.destination_name : "Unknown Destination";

        return {
          ...pkg,
          categoryName,
          destinationName,
        };
      })
    : [];

  const filteredPackages = agentPackages.filter((pkg) =>
    Object.values(pkg)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages?.slice(indexOfFirstPackage, indexOfLastPackage) || [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (packageData) => {
    setIsEditModalOpen(true);
    setSelectedPackageId(packageData.id);
    setSelectedPackage(packageData);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPackageId(null);
    setSelectedPackage(null);
  };

  const handleOpenDeleteModal = (packageData) => {
    setIsDeleteModalOpen(true);
    setPackageIdToDelete(packageData.id);
    setSelectedPackage(packageData);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPackage(null);
    setPackageIdToDelete(null);
  };

  const handleOpenAddActivityModal = (packageId) => {
    setSelectedPackageId(packageId);
    setIsAddActivityModalOpen(true);
  };

  const handleCloseAddActivityModal = () => {
    setIsAddActivityModalOpen(false);
  };

  const handleOpenViewActivityModal = (packageId) => {
    setSelectedPackageId(packageId);
    setIsViewActivitiesModalOpen(true);
  };

  const handleCloseViewActivitiesModal = () => {
    setIsViewActivitiesModalOpen(false);
    setSelectedPackageId(null);
    setSelectedPackage(null);
  };

  const handleAddSubmit = async (formData) => {
    try {
      await dispatch(handleAddPackage(formData));
      console.log("Package added successfully");
      toast.success("Package added successfully!");
      dispatch(handleGetAgentPackages(agentId));
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Failed to add package. Please try again.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await dispatch(handleEditPackage({ id: selectedPackageId, formData }));
      console.log("Package edited successfully");
      toast.success("Edited successfully!");
      dispatch(handleGetAgentPackages(agentId));
      handleCloseEditModal();
    } catch (error) {
      console.error("Error editing package:", error);
      toast.error("Failed to edit package. Please try again.");
    }
  };

  const handleDeleteSubmit = async () => {
    if (packageIdToDelete) {
      try {
        await dispatch(handleDeletePackage(packageIdToDelete));
        console.log("Package deleted successfully");
        handleCloseDeleteModal();
        dispatch(handleGetAgentPackages(agentId));
        toast.success("Package deleted successfully!");
      } catch (error) {
        console.error("Error deleting package:", error);
        toast.error("Failed to delete package. Please try again.");
      }
    }
  };

  const handleAddActivitySubmit = async (activities) => {
    try {
      const formData = activities.map((activity) => ({
        day: activity.day,
        description: activity.description,
      }));

      await dispatch(handleAddNewActivity({ formData, id: selectedPackageId }));
      console.log("Activities added successfully");
      handleCloseAddActivityModal();
      toast.success("Activities added successfully!");
    } catch (error) {
      console.error("Error adding activities:", error);
      toast.error("Failed to add activities. Please try again.");
    }
  };

  
  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-gray-800 animate-spin mb-4" />
      </div>
    );
  }
  return (
    <div className="">
      <div className="">
      <header className=" border-b-4 border-indigo-600">
        <input
          className="w-full py-4 px-6 rounded-md pl-2 outline-none focus:outline-none active:outline-none"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>
      </div>
      <button
        type="button"
        className="text-white bg-violet-500 hover:bg-violet-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 ml-2 mb-4 mt-4"
        onClick={handleOpenAddModal}
      >
        Add Tour Package
      </button>

      {isAddModalOpen && (
        <AddPackageModal
          isOpen={isAddModalOpen}
          onSubmit={handleAddSubmit}
          onClose={handleCloseAddModal}
          agentId={agentId}
        />
      )}

      {isAddActivityModalOpen && (
        <AddPackageActivityModal
          isOpen={isAddActivityModalOpen}
          packageId={selectedPackageId}
          onSubmit={handleAddActivitySubmit}
          onClose={handleCloseAddActivityModal}
        />
      )}

      {isEditModalOpen && (
        <EditPackageModal
          isOpen={isEditModalOpen}
          packages={selectedPackage}
          onSubmit={handleEditSubmit}
          onClose={handleCloseEditModal}
        />
      )}

      {isDeleteModalOpen && (
        <DeletePackageModal
          isOpen={isDeleteModalOpen}
          packageIdToDelete={packageIdToDelete}
          packages={selectedPackage}
          onConfirm={handleDeleteSubmit}
          onClose={handleCloseDeleteModal}
        />
      )}

      {isViewActivitiesModalOpen && (
        <ViewActivitiesModal
          isOpen={isViewActivitiesModalOpen}
          onClose={handleCloseViewActivitiesModal}
          packageId={selectedPackageId}
        />
      )}

{(!filteredPackages || filteredPackages.length === 0) ? (
  <p>No packages found.</p>
) : (
      <div className="">
        
        <table className=" w-full border-collapse bg-white text-left text-sm text-gray-500 ">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-4 font-medium text-gray-900 text-center">
                Package Name
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-gray-900 text-center">
                Description
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-gray-900 text-center">
                Destination
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-gray-900 text-center">
                Category
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-gray-900 text-center">
                Duration
              </th>
              <th scope="col" className="px-4 py-4 font-medium text-gray-900 text-center">
                Price
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                Image
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                Activities
              </th>

              <th scope="col" className="px-6 py-4 font-medium text-gray-900 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="">
            {currentPackages.map((pkg) => (
              <tr key={pkg.id}>
                <td className="px-6 py-4 text-center">{pkg.package_name}</td>
                <td className="px-6 py-4 text-center break-all">{pkg.description}</td>
                <td className="px-6 py-4 text-center">{pkg.destinationName}</td>
                <td className="px-6 py-4 text-center">{pkg.categoryName}</td>
                <td className="px-6 py-4 text-center">{pkg.duration}</td>
                <td className="px-6 py-4 text-center">{pkg.price}</td>
                <td className="px-6 py-4 text-center">
                  {pkg.image && (
                    <img
                      src={`http://127.0.0.1:8000${pkg.image}`}
                      alt={pkg.package_name}
                      className="w-20 h-20 rounded-lg"
                    />
                  )}
                </td>
                <td className="px-6 py-4 flex justify-around">
                  <button
                    className="text-white bg-violet-500 hover:bg-violet-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-2 m-1"
                    onClick={() => handleOpenAddActivityModal(pkg.id)}
                  >
                    Add Activities
                  </button>

                  <button
                    className="text-white bg-violet-500 hover:bg-violet-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 m-1"
                    onClick={() => handleOpenViewActivityModal(pkg.id)}>
                    View Activities
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                      onClick={() => handleOpenEditModal(pkg)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                      onClick={() => handleOpenDeleteModal(pkg)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       )}
      <div className="flex justify-center mt-4 mb-2">
        {filteredPackages.length > packagesPerPage && (
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              {Array.from({ length: Math.ceil(filteredPackages.length / packagesPerPage) }, (_, i) => (
                <li key={i} className="mr-2 ">
                  <button
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-indigo-500"
                    }`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default PackageTable;

