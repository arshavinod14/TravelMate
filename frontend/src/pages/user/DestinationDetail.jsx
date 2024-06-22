import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchingDestination } from "../../redux/reducers/destination/destinationReducer";
import { useParams } from "react-router-dom";
import { handleFetchingPackages } from "../../redux/reducers/tourpackage/packageReducer";
import { handleFetchCategory } from "../../redux/reducers/admin/adminReducer";
import { FaSpinner } from "react-icons/fa";

export default function DestinationDetail() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.destination?.loading);
  const destinations = useSelector((s) => s.destination?.destinations);
  const packages = useSelector((state) => state.package?.packages);
  const categories = useSelector((state) => state.admin?.category);
  const { id } = useParams();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Number of items per page

  // Find the clicked destination from the destinations array
  const destination = destinations.find((dest) => dest.id === parseInt(id, 10));

  useEffect(() => {
    dispatch(handleFetchingDestination());
    dispatch(handleFetchingPackages());
    dispatch(handleFetchCategory());
  }, []);

  useEffect(() => {
    if (packages && destination) {
      // Filter packages of the selected destination initially
      setFilteredPackages(packages.filter(pkg => pkg.destination_id === destination.id));
    }
  }, [packages, destination]);

  useEffect(() => {
    let newFilteredPackages = packages.filter(pkg => pkg.destination_id === destination.id);
  
    if (selectedCategories.length > 0) {
      // Filter by selected categories
      newFilteredPackages = newFilteredPackages.filter((packageItem) => {
        const packageCategory = packageItem.category.toString();
        return selectedCategories.includes(packageCategory);
      });
    }
  
    // Filter by price range
    newFilteredPackages = newFilteredPackages.filter((packageItem) => {
      return packageItem.price >= priceRange.min && packageItem.price <= priceRange.max;
    });
  
    setFilteredPackages(newFilteredPackages);
  }, [packages, destination, priceRange, selectedCategories]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevState) => ({
      ...prevState,
      [name]: parseInt(value),
    }));
  };

  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedCategories((prevCategories) => [...prevCategories, value]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((category) => category !== value)
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the current packages to display based on pagination
  const indexOfLastPackage = currentPage * itemsPerPage;
  const indexOfFirstPackage = indexOfLastPackage - itemsPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <>
      {destination && (
        <div className="relative bg-cover bg-center h-[500px]">
          <img
            loading="lazy"
            className="h-full w-full object-cover"
            src={destination.image}
            alt=""
          />
          <div className="absolute bottom-7 left-0 p-3 text-white font-bold text-3xl">
            {destination.destination_name}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 flex justify-between">
        <div className="w-1/4 pr-10">
          <div className="filter-box bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Price Filter</h3>
            <div className="flex items-center mb-2">
              <input
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceChange}
                className="w-1/2 mr-2 px-2 py-1 rounded-md"
              />
              <span>-</span>
              <input
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceChange}
                className="w-1/2 ml-2 px-2 py-1 rounded-md"
              />
            </div>
          </div>
          <div className="filter-box bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            {categories &&
              categories.length > 0 &&
              categories.map((cat) => (
                <div key={cat.id}>
                  <label className="inline-flex items-center mb-2 ml-2">
                    <input
                      type="checkbox"
                      value={cat.id} // Use category ID as value
                      onChange={handleCategoryChange}
                      className="mr-2"
                    />
                    {cat.name}
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div className="w-3/4">
          {currentPackages.length > 0 ? (
            currentPackages.map((pkg) => {
              const destinationObj = destinations.find(
                (dest) => dest.id === pkg.destination_id
              );
              const destinationName = destinationObj
                ? destinationObj.destination_name
                : "Unknown Destination";
              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 mb-8 flex items-center"
                >
                  <img
                    src={`http://127.0.0.1:8000${pkg.image}`}
                    alt="Package"
                    className="w-1/3 h-44 object-cover"
                  />
                  <div className="p-4 flex-grow flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          className="h-5 w-5 fill-current text-red-500"
                        >
                          <path
                            fill="#d52c20"
                            d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                          />
                        </svg>
                        <h1 className="ml-1 text-sm font-normal text-slate-500">
                          {destinationName}
                        </h1>
                      </div>
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        {pkg.package_name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <span className="text-orange-500 font-bold mr-2">
                          {pkg.price.toString().split(".")[0]}
                        </span>
                        <span className="text-gray-500 text-sm">/ Day</span>
                      </div>
                    </div>
                    <Link to={`/package-details/${pkg.id}`}>
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          className="h-5 w-5 m-2 "
                        >
                          <path
                            fill="#c2c7d1"
                            d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                          />
                        </svg>
                        <h1 className="text-slate-500 p-1">Explore Now</h1>
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No packages available.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  pageNumber === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
