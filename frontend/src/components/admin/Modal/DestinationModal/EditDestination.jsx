import React, { useState, useEffect } from "react";

const EditDestinationModal = ({ isOpen, destination, onSubmit, onClose }) => {
  const [destinationName, setDestinationName] = useState(
    destination?.destination_name || ""
  );
  const [destinationDescription, setDestinationDescription] = useState(
    destination?.description || ""
  );
  const [imageFile, setImageFile] = useState(null); // To store the selected image for editing

  // Optional state to track the original image URL (if available)
  const [originalImage, setOriginalImage] = useState(destination?.image || "");

  useEffect(() => {
    setDestinationName(destination?.destination_name || "");
    setDestinationDescription(destination?.description || "");
    setOriginalImage(destination?.image || ""); // Set original image URL on modal open
  }, [destination]); // Update state when destination changes

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "destination_name") {
      setDestinationName(value);
    } else if (name === "description") {
      setDestinationDescription(value);
    }

    // console.log("Destination", name, value);
  };

  const handleImageChange = (event) => {
    console.log("Files selected:", event.target.files);
    setImageFile(event.target.files[0]);
  };


  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
        id: destination.id,
        destination_name: destinationName,
        description: destinationDescription,
        // image: imageFile ? imageFile : (originalImage ? originalImage : null)
        image: imageFile ? imageFile : null 
    };


    if (!imageFile && originalImage) {
        try {
            const response = await fetch(originalImage);
            const blob = await response.blob();
            formData.image = new File([blob], "image.jpeg", { type: blob.type });
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    }

    try {
        await onSubmit(formData); // Pass the entire formData object to the onSubmit function
        onClose(); // Close the modal after successful edit
    } catch (error) {
        console.error("Error editing destination:", error);
        // Handle error (e.g., display error message to user)
    }
};


  return (
    isOpen && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out">
        <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-sm p-10 ">
          <h1 className="text-center text-3xl mb-10">Edit Destination</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-4 ">
              <label className="mr-4" htmlFor="destination_name">
                Destination Name:
              </label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="destination_name"
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
              {originalImage && (
                <p className="text-gray-600 mt-1">
                  Current Image: {originalImage}
                </p>
              )}
            </div>

            <div className="flex flex-row justify-between">
              <button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditDestinationModal;
