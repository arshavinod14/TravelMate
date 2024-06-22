import React from "react";
import img1 from "../assets/image5.jpg";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchingDestination } from "../redux/reducers/destination/destinationReducer";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/user/Navbar";
import { FaSpinner } from "react-icons/fa";

function DestinationPage() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.destination?.loading);
  const destinations = useSelector((s) => s.destination?.destinations);
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(handleFetchingDestination());
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-orange-600 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-cover bg-center h-[400px]">
        <img loading="lazy" className="h-full w-full object-cover" src={img1} alt="" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white font-bold text-4xl">Destinations</h2>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((destination) => (
  
            <div
                    key={destination?.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100"
                  >
                    <Link
                      to={`/destination-details/${destination.id}`}
                      className="block"
                    >
                      <img
                        src={`http://127.0.0.1:8000${destination?.image}`}
                        alt="Package"
                        className="w-full h-28 object-cover object-center"
                      />
                    </Link>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-blue-800 mb-2">
                        {destination?.destination_name}
                      </h3>
                      <div className="">
                      <p className="text-xs">{destination?.description}</p>
                      </div>
                    </div>
                  </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DestinationPage;