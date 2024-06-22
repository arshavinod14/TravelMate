import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRatings from "react-star-ratings";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleFetchingActivities, handleFetchingPackages } from "../../../redux/reducers/tourpackage/packageReducer";
import hotelLogo from "../../../assets/3-star.svg";
import transport from "../../../assets/transport.svg";
import meals from "../../../assets/meal.svg";
import sightseeing from "../../../assets/sightseeing.svg";
import ReviewComponent from "./ReviewComponent";
import { handleViewReviews } from "../../../redux/reducers/user/userReducer";
import defaultImg from '../../../assets/default_person.png'
import { handleFetchingUsers } from "../../../redux/reducers/admin/adminReducer";
import { FaSpinner } from "react-icons/fa";

export default function PackageDetails() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s?.package?.loading);
  const packages = useSelector((s) => s?.package?.packages);
  const reviews = useSelector((s) => s?.user?.reviews); 
  const users = useSelector((state) => state.admin?.users);
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("authTokens");

  const package_s = packages.find(pack => pack.id === parseInt(id, 10));

  useEffect(() => {
    dispatch(handleFetchingPackages(id));
    dispatch(handleFetchingUsers());
    // Scroll to the top when the component mounts
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  const activitiesPackage = useSelector((state) =>state.package.activities.filter((activity) => activity.activity_package === package_s.id))

  useEffect(() => {
    if (package_s?.id) {
      dispatch(handleFetchingActivities(package_s.id));
      dispatch(handleViewReviews(package_s.id)); // Dispatch action to fetch reviews
    }
    window.scrollTo(0, 0);
  }, [dispatch, package_s?.id]);

  const handleBookNow = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/booking?packageName=${encodeURIComponent(package_s.package_name)}&packagePrice=${package_s.price}&packageId=${package_s.id}&packageDuration=${package_s.duration}`);
    }
  };

  // Show toast message after navigating to the login page
  useEffect(() => {
    if (!token) {
      toast.success("Please login first to book the package. Thank you!");
    }
    window.scrollTo(0, 0);
  }, [token]);

  if (!packages || !package_s) {
    return <div>Loading...</div>; // or render an error message
  }

  

  const reviewsWithUserNames = reviews.map((review) => {
    const customerObj = users?.user?.find((user) => user.id === review.user);
    const customerName = customerObj ? `${customerObj.first_name} ${customerObj.last_name}` : "N/A";
    return { customerName, comment: review.comment,rating: review.rating,date: review.created_at};
  });

  const totalRatingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRatingSum / reviews.length : 0;


  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen">
      
      {package_s && (
        <div className="relative bg-cover bg-center h-[500px]">
          <img
            loading="lazy"
            className="h-full w-full object-cover "
            src={package_s.image}
            alt=""
          />
          <div className="absolute bottom-7 left-0 p-3 text-white font-bold text-3xl">
            {package_s.package_name}
          </div>
        </div>
      )}
      <section className="bg-white">
        <div className="container px-6 py-10 mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-black">
            Package Details
          </h1>

          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-black">
              Package Information
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <p className="text-slate-800">Number of Days: {package_s.duration}</p>
              <br />
              <div className="flex flex-row gap-8">
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={hotelLogo}
                    alt="Hotel Logo"
                  />
                  <p className="text-center">Accommodation</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={transport}
                    alt="Transport Logo"
                  />
                  <p className="text-center ">Transfer</p>
                </div>
                <div className="flex flex-col justify-center items-centerr">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={meals}
                    alt="Meals Logo"
                  />
                  <p className="text-center ">Meals</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={sightseeing}
                    alt="Sightseeing Logo"
                  />
                  <p className="text-center">Sightseeing</p>
                </div>
              </div>
              <div className="mt-4 flex flex-row">
                <p className="text-slate-800">Description: </p>
                <p className="text-slate-800">{package_s?.description}</p>
              </div>
              <div className="mt-4 flex flex-row">
                <p className="text-slate-800">Price:</p>
                <p className="text-slate-800">{parseInt(package_s?.price)} per person</p>
              </div>
            </p>
            <div className="flex flex-row ">
              <p className=""> Ratings: </p>
              <StarRatings
                className="ml-4"
                rating={averageRating}
                starRatedColor="#FFD700"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
              />
            </div>

            <div className="mt-4 mb-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleBookNow}
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="border p-10 mt-5">
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-black">
                Itinerary
              </h3>
            </div>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
              {activitiesPackage.map((activity, index) => (
                <li key={activity.id} className="mb-10 ms-4">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.3 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    Day {activity.day}
                  </time>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Activity {index + 1}
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 break-all">
                    {activity.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
      <div>
      <ReviewComponent packageId={package_s.id} />
  <section class="py-24 relative">
    <div class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
      <div class="w-full">
        <h2 class="font-manrope font-bold text-4xl text-black mb-8 text-center">Our customer reviews</h2>

        {reviewsWithUserNames && reviewsWithUserNames.length > 0 ? (
  reviewsWithUserNames.map((review, index) => (
    <div key={index} class="pt-11 pb-8 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto">
      <div class="flex items-center gap-3 mb-4">
        {Array(review.rating).fill().map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <g clip-path="url(#clip0_13624_2892)">
              <path d="M14.1033 2.56698C14.4701 1.82374 15.5299 1.82374 15.8967 2.56699L19.1757 9.21093C19.3214 9.50607 19.6029 9.71064 19.9287 9.75797L27.2607 10.8234C28.0809 10.9426 28.4084 11.9505 27.8149 12.5291L22.5094 17.7007C22.2737 17.9304 22.1662 18.2614 22.2218 18.5858L23.4743 25.8882C23.6144 26.7051 22.7569 27.3281 22.0233 26.9424L15.4653 23.4946C15.174 23.3415 14.826 23.3415 14.5347 23.4946L7.9767 26.9424C7.24307 27.3281 6.38563 26.7051 6.52574 25.8882L7.7782 18.5858C7.83384 18.2614 7.72629 17.9304 7.49061 17.7007L2.1851 12.5291C1.59159 11.9505 1.91909 10.9426 2.73931 10.8234L10.0713 9.75797C10.3971 9.71064 10.6786 9.50607 10.8243 9.21093L14.1033 2.56698Z" fill="#FBBF24"/>
            </g>
            <defs>
              <clipPath id="clip0_13624_2892">
                <rect width="30" height="30" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        ))}
      </div>
      <div class="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-4">
        <div class="flex items-center gap-3">
          <img src={defaultImg} alt='image' class="w-8 h-8 rounded-full"/>
          <h6 class="font-semibold text-lg leading-8 text-indigo-600">{review.customerName}</h6>
          <p class="font-normal text-lg leading-8 text-gray-400 max-xl:text-justify">{review.comment}</p>
        </div>
        <p class="font-normal text-lg leading-8 text-gray-400">{new Date(review.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}</p>
      </div>
    </div>
  ))
) : (
  <p>No reviews available.</p>
)}

      </div>
    </div>
  </section>
</div>

        </div>
      </section>
    </div>
  );
}

