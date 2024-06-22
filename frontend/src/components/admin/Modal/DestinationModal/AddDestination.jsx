import React, { useState } from 'react';

const AddDestinationModal = ({ isOpen, onSubmit, onClose }) => {
  const [destinationName, setDestinationName] = useState('');
  const [destinationDescription, setDestinationDescription] = useState('');
  const [imageFile, setImageFile] = useState(null); // Optional for handling image changes

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'destination_name') {
      setDestinationName(value);
    } else if (name === 'description') {
      setDestinationDescription(value);
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare form data (consider using FormData for image handling)
    const formData = new FormData();
    formData.append('destination_name', destinationName);
    formData.append('description', destinationDescription);
    if (imageFile) {
      formData.append('image', imageFile);
    }
   
    // Call the onSubmit prop function (pass data)
    await onSubmit(formData);
    onClose(); // Close the modal after successful submission
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out">
        <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-sm p-10 ">
          <h1 className="text-center text-3xl mb-10">Add Destination</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-4 ">
              <label className="mr-4" htmlFor="destination">
                Destination Name:
              </label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="destination"
                name="destination_name"
                value={destinationName}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-x-4 mt-2">
              <label className="" htmlFor="description">
                Description
              </label>
              <textarea
                className="border border-slate-950"
                name="description"
                id="description"
                value={destinationDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-x-4 mt-2">
              <label htmlFor="image">Image:</label>
              <input
                className="m-2 "
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>

            <div className="flex flex-row justify-between">
              <button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
              >
                Submit
              </button>
              <button
                type="button"
                className="text-white bg-slate-500 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddDestinationModal;
