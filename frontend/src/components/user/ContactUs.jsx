import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img1 from "../../assets/travel-train-station.svg";
import { handleContactMessage } from '../../redux/reducers/user/userReducer';

function ContactUs() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(handleContactMessage(formData)).then((result) => {
      if (result.payload.success) {
        // Show success toast
        toast.success(result.payload.message);
        // Reset form fields
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Show error toast
        toast.error(result.payload.error);
      }
    });
  };

  return (
    <div>
  
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            {/* Replace Google Map iframe with an image */}
            <img
              src={img1}
              alt="Location"
              className="absolute inset-0 w-full h-full bg-white"
            />
            
          </div>
          <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
              </div>
              <button type="submit" className="text-white bg-orange-400 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Submit</button>
            </form>
            <p className="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
