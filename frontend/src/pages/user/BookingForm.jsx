import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { handleBooking } from '../../redux/reducers/user/userReducer';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BookingForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const customer = useSelector((state) => state?.user?.userDetails);
  const [name, setName] = useState(customer ? `${customer.first_name} ${customer.last_name}` : '');
  const [email, setEmail] = useState(customer ? customer.email : '');
  const [phone, setPhone] = useState(customer ? customer.phone : '');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [numTravelers, setNumTravelers] = useState(1);
  const [packageDetails, setPackageDetails] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const packageName = searchParams.get('packageName');
    const packagePrice = searchParams.get('packagePrice');
    const packageDuration = searchParams.get('packageDuration');
    const packageId = searchParams.get('packageId');

    console.log("packagePrice: " + packagePrice)
    console.log("packageDuration: " + packageDuration)
    console.log("packageId: " + packageId)
    setPackageDetails({
      id: packageId,
      name: packageName,
      price: packagePrice,
      duration: packageDuration
    });
  }, [location.search]);

  const calculateTotalCost = () => {
    if (packageDetails) {
      return parseInt(packageDetails.price) * parseInt(packageDetails.duration) * numTravelers;
    }
    return 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      user: customer.id,
      package: packageDetails.id,
      total_cost: calculateTotalCost(),
      name: name,
      email: email,
      phone: phone,
      bookingDate: bookingDate,
      numTravelers: numTravelers,
    };

    try {
      const bookingData = await dispatch(handleBooking(formData));
      // Navigate to the success page with the necessary data
      console.log("Booking Data: " + bookingData)
      navigate('/success', { state: bookingData });
      toast.success('Booking Successful');
    } catch (error) {
      // Handle error
      console.error('Error occurred while booking:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
          Booking
        </div>
        <form className="py-4 px-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          {/* Package */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="package">
              Package
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="package"
              type="text"
              value={packageDetails ? packageDetails.name : ''}
              readOnly
            />
          </div>
          {/* Booking Date */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="bookingDate">
              Booking Date
            </label>
            <DatePicker
              id="bookingDate"
              selected={bookingDate}
              onChange={date => setBookingDate(date)}
              minDate={new Date()}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {/* Number of Travelers */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="numTravelers">
              Number of Travelers
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="numTravelers"
              type="number"
              min="1"
              value={numTravelers}
              onChange={(event) => setNumTravelers(event.target.value)}
            />
          </div>
          {/* Total Cost */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="totalCost">
              Total Cost
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="totalCost"
              type="text"
              value={calculateTotalCost()}
              readOnly
            />
          </div>
          {/* Submit Button */}
          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
