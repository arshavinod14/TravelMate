import React, { useState, useEffect } from "react";
import img1 from "../assets/image6.jpg";
import img2 from "../assets/image5.jpg";
import img3 from "../assets/image3.jpg";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DestinationCard from "../components/user/DestinationCard";
import PackageCard from "../components/user/package/PackageCard";
import CategoryFilter from "../components/user/CategoryFilter";
import Testimonials from "./user/Testimonials";
import { FaSpinner } from "react-icons/fa";

export default function Homepage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); 
  const images = [img1, img2, img3];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Simulate loading time for demonstration purposes
    setTimeout(() => setLoading(false), 2000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl  text-orange-600 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col">
        <div
          className="h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentImageIndex]})`}}
        >
          <div className="flex flex-col items-center justify-center h-full bg-gray-900 bg-opacity-50">
            <h1 className="text-6xl font-bold text-white">Make trip easy with us.</h1>
            <p className="mt-2 text-3xl font-thin text-white">Explore different travel packages.</p>
          </div>
        </div>
        <section className="">
          <DestinationCard />
        </section>
        <section className="">
          <PackageCard />
        </section>
        <section>
          <Testimonials />
        </section>
        <section>
          <CategoryFilter />
        </section>
      </div>
    </div>
  );
}
