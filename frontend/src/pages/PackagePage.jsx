import React, { useEffect, useState } from "react";
import img1 from "../assets/image6.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleFetchingPackages } from "../redux/reducers/tourpackage/packageReducer";
import { handleFetchCategory } from "../redux/reducers/admin/adminReducer";
import { handleFetchingDestination } from "../redux/reducers/destination/destinationReducer";
import { FaSpinner } from 'react-icons/fa';

function PackagePage() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.package?.loading);
  const packages = useSelector((s) => s.package?.packages);
  const categories = useSelector((s) => s.admin?.category);
  const destinations = useSelector((state) => state.destination?.destinations);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Number of items per page

  useEffect(() => {
    dispatch(handleFetchingPackages());
    dispatch(handleFetchCategory());
    dispatch(handleFetchingDestination());
  }, [dispatch]);

  useEffect(() => {
    // Set filtered packages initially to all packages
    setFilteredPackages(packages);
  }, [packages]);

  useEffect(() => {
    // Filter packages based on price range and selected categories
    let newFilteredPackages = packages.filter((packageItem) => {
      const packageCategory = packageItem.category.toString();
      return (
        packageItem.price >= priceRange.min &&
        packageItem.price <= priceRange.max &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(packageCategory))
      );
    });
    setFilteredPackages(newFilteredPackages);
  }, [priceRange, selectedCategories, packages]);

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
        {/* backdrop-blur- bg-gray-900  */}
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
        {/* <h1 className="text-2xl text-gray-200 font-semibold">Loading...</h1> */}
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-cover bg-center h-[400px]">
        <img
          loading="lazy"
          className="h-full w-full object-cover"
          src={img1}
          alt=""
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white font-bold text-4xl">Tour Packages</h2>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex">
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
            {categories.map((cat) => (
              <div key={cat?.id}>
                <label className="inline-flex items-center mb-2 ml-2">
                  <input
                    type="checkbox"
                    value={cat?.id} // Use category ID as value
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-36">
            {currentPackages.length > 0 ? (
              currentPackages.map((packageItem) => {
                const destinationObj = destinations.find((dest) => dest.id === packageItem.destination_id);
                const destinationName = destinationObj ? destinationObj.destination_name : 'Unknown Destination';
                return (
                  <div
                    key={packageItem?.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100"
                  >
                    <Link
                      to={`/package-details/${packageItem.id}`}
                      className="block"
                    >
                      <img
                        src={`http://127.0.0.1:8000${packageItem?.image}`}
                        alt="Package"
                        className="w-full h-48 object-cover object-center"
                      />
                    </Link>
                    <div className="p-4">
                      <span className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-5 w-5 fill-current text-red-500">
                          <path fill="#d52c20" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                        </svg>
                        <h1 className="ml-1  text-sm font-normal text-slate-500">{destinationName}</h1>
                      </span>
                      <h3 className="text-base font-semibold text-blue-800 mb-2">
                        {packageItem?.package_name}
                      </h3>
                      <p className="text-sm font-bold text-orange-500">
                        {packageItem?.price.toString().split(".")[0]}
                      </p>
                      <p className="text-xs break-all">{packageItem?.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center">No packages available.</div>
            )}
          </div>

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

export default PackagePage;
