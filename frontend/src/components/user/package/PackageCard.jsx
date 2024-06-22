import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchingPackages } from "../../../redux/reducers/tourpackage/packageReducer";
import { Link, useNavigate } from "react-router-dom";
import { handleFetchingDestination } from "../../../redux/reducers/destination/destinationReducer";
import { handleAllReviews } from "../../../redux/reducers/user/userReducer";
import { FaSpinner } from "react-icons/fa";

export default function PackageCard() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.package?.loading);
  const packages = useSelector((s) => s.package?.packages);
  const destinations = useSelector((state) => state.destination?.destinations);
  const navigate = useNavigate();
  const reviews = useSelector((s) => s?.user?.reviews);

  useEffect(() => {
    dispatch(handleFetchingPackages());
    dispatch(handleFetchingDestination());
    dispatch(handleAllReviews());
  }, [dispatch]);

  console.log("reviews", reviews);
  console.log("packages in packagecard", packages);
  console.log("description:", packages[0]?.package_name);

  const handlePackageClick = (packageItem) => {
    navigate(`/package-list-detail/${packageItem.id}`);
  };

  const destinationNames = packages.map((packageItem) => {
    const destinationObj = destinations.find((dest) => dest.id === packageItem.destination_id);
    const destinationName = destinationObj ? destinationObj.destination_name : "Unknown Destination";
    return destinationName;
  });

  console.log("destinationName:", destinationNames);

  const calculateAverageRating = (packageId) => {
    if (!reviews) {
      return 0;
    }
  
    const packageReviews = reviews.filter((review) => review.package === packageId);
    if (packageReviews.length === 0) {
      return 0;
    }
  
    const totalRating = packageReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / packageReviews.length;
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
      <div className="flex flex-col m-14 mt-5">
        <h1 className="text-4xl font-bold">Top Packages</h1>
        <Link to="listOfPackage">
          <span className="flex items-center m-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-5 w-5 m-2"
            >
              <path
                fill="#2e79b2"
                d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
              />
            </svg>
            <h1 className="bg-orange-600 text-slate-200 p-1">View All Packages</h1>
          </span>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages
            .filter((packageItem) => packageItem.is_top_package)
            .slice(0, 4)
            .map((packageItem, index) => {
              const averageRating = calculateAverageRating(packageItem.id);
              const reviewCount = reviews.filter((review) => review.package === packageItem.id).length;

              return (
                <div
                  key={packageItem?.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/package-details/${packageItem?.id}`} onClick={() => handlePackageClick(packageItem)}>
                    <img
                      src={`http://127.0.0.1:8000${packageItem?.image}`}
                      alt="City"
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            className="h-4 w-4 m-1 fill-current text-red-500"
                          >
                            <path
                              fill="#d52c20"
                              d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                            />
                          </svg>
                          <span className="text-xs text-gray-600">{destinationNames[index]}</span>
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900">{packageItem?.package_name}</h3>
                      <div className="mt-2 flex items-center">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < averageRating ? "text-yellow-500" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927C9.276 2.351 9.724 2 10.234 2c.511 0 .959.351 1.185.927l1.69 4.145 4.58.66c.554.08.972.463 1.086 1.005.113.541-.13 1.104-.584 1.354l-3.313 2.41.78 4.556c.093.54-.14 1.096-.594 1.354-.454.257-1.01.192-1.418-.17L10 14.347l-3.945 2.072c-.408.362-.964.427-1.418.17-.454-.258-.687-.814-.594-1.354l.78-4.556L1.51 10.091c-.454-.25-.697-.813-.584-1.354.114-.542.532-.925 1.086-1.005l4.58-.66L9.049 2.927z" />
                              </svg>
                            ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{packageItem?.price.toString().split(".")[0]}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 7a1 1 0 011 1v5a1 1 0 002 0V8a3 3 0 10-6 0v5a1 1 0 002 0V8a1 1 0 011-1zM12 14a4 4 0 00-4 4 1 1 0 001 1h6a1 1 0 001-1 4 4 0 00-4-4z" />
                          </svg>
                          {packageItem?.duration} days
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
