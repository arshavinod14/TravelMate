import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleFetchingDestination } from "../../redux/reducers/destination/destinationReducer";
import { FaSpinner } from "react-icons/fa";

export default function DestinationCard() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.destination?.loading);
  const destinations = useSelector((s) => s.destination?.destinations); // Get destinations from Redux store
  const navigate = useNavigate();

  const [fetchedDestinations, setFetchedDestinations] = useState([]); // Local state for fetched destinations
  const [currentIndex, setCurrentIndex] = useState(0); // State to manage the current index of displayed destinations
  const cardsToShow = 4; // Number of cards to show at once

  useEffect(() => {
    dispatch(handleFetchingDestination()); // Fetch destinations on component mount
  }, [dispatch]); // Dependency array to avoid infinite loop

  useEffect(() => {
    if (destinations) {
      setFetchedDestinations(destinations); // Update local state when destinations are fetched
    }
  }, [destinations]); // Dependency array to update on destination changes

  const handleDestinationClick = (destination) => {
    navigate(`/destination-details/${destination.id}`);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, fetchedDestinations.length - cardsToShow));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col m-16">
      <h1 className="text-sm ">Where to Go</h1>
      <h2 className="text-4xl font-bold">Popular Destinations</h2>
      <Link to="destinations-page" className="flex items-center self-start"> {/* Adjusted alignment */}
        <span className="flex items-center m-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5 m-2">
            <path fill="#2e79b2" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
          <h1 className="bg-orange-600 text-slate-200 p-1">View All Destinations</h1>
        </span>
      </Link>

      <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-5 relative">
        <button
          onClick={handlePrevClick}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex space-x-5">
          {/* Dynamically render up to 4 destination cards */}
          {fetchedDestinations.slice(currentIndex, currentIndex + cardsToShow).map((destination) => (
            <div
              key={destination.id}
              className="relative flex-shrink-0 w-1/4 transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Link to={`/destination-details/${destination.id}`}>
                <div className="relative w-full h-80 overflow-hidden rounded-lg shadow-lg bg-black">
                  <img
                    alt={destination.destination_name}
                    className="block h-full w-full object-cover object-center"
                    src={`http://127.0.0.1:8000${destination.image}`}
                  />
                  <div className="absolute top-0 left-0 w-full p-4 text-white flex justify-between items-start">
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
                    <div className="flex justify-center items-center">
                      <div className="text-center">
                        <h4 className="text-xl font-bold">{destination.destination_name}</h4>
                        <p className="mt-2 text-sm">Explore Now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <button
          onClick={handleNextClick}
          className="absolute -right-14 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
