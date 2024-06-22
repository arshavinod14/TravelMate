import React from "react";
import DatePicker from "react-datepicker";
import { FaSearch } from "react-icons/fa";

export const SearchComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState(null);

  return (
    <div className="absolute inset-x-0 mx-auto bg-gray-200 bg-opacity-80 rounded-lg p-4 w-1/2 bottom-36">
      <h2 className="text-xl font-bold text-gray-800">Featured Content</h2>
      <p className="mt- text-gray-600">
        Check out our latest featured articles and updatddddddddddes.
      </p>
      <div className="mt-4 flex flex-col md:flex-row md:items-center">
        <label className="md:mr-2 py-1 text-gray-800">Destination:</label>
        <select className="px-3 py-2 rounded-lg border-gray-300 focus:ring focus:border-blue-300 md:flex-grow outline-none">
          <option value="">Select destination...</option>
          <option value="destination1">Destination 1</option>
          <option value="destination2">Destination 2</option>
        </select>

        <label className="mt-4 md:mt-0 md:ml-4 md:mr-2 text-gray-800">
          Date:
        </label>
        <DatePicker
          minDate={Date.now()}
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="px-3 py-2 rounded-lg border-gray-300 focus:ring focus:border-blue-300 md:outline-none"
          placeholderText="Select date..."
        />

        <button className="mt-4 md:mt-0 ml-0 md:ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
          <FaSearch className="inline" /> Search
        </button>
      </div>
    </div>
  );
};
