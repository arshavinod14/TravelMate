import React, { useState } from "react";

const EditPackageModal = ({ isOpen, packages, onSubmit, onClose }) => {

    const [packageName, setPackageName] = useState(packages?.package_name || "");
    const [duration, setDuration] = useState(packages?.duration || "");
    const [price, setPrice] = useState(packages?.price || "");
    const [description, setDescription] = useState(packages?.description || "");
    const [isTopPackage, setIsTopPackage] = useState(
        packages?.is_top_package ? packages.is_top_package : false
      );
   
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "package_name") {
      setPackageName(value);
    } else if (name === "duration") {
      setDuration(value);
    } else if (name === "price") {
      setPrice(value);
    } else if (name === "description") {
        setDescription(value);
    } else if (name === "is_top_package"){
        setIsTopPackage(value);
    }
  };

  const handleSubmit = async (event) => {
    console.log("hello from handleSubmit")
    event.preventDefault();

    const formData = {
      id: packages.id,
      package_name: packageName,
      duration,
      price,
      description,
      is_top_package: isTopPackage,
    };

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error editing package:", error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out">
        <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-sm p-10 ">
          <h1 className="text-center text-3xl mb-10">Edit Package</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-4">
              <label className="mr-4" htmlFor="package_name">Package Name:</label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="package_name"
                name="package_name"
                value={packageName}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-x-4 mt-2">
              <label className="">Duration (days):</label>
              <input
                className="border border-slate-950 p-1"
                type="number"
                min="1"
                id="duration"
                name="duration"
                value={duration}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-x-4 mt-2">
              <label className="">Price:</label>
              <input
                className="border border-slate-950 p-1"
                type="number"
                min="0"
                id="price"
                name="price"
                value={price}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-x-4 mt-2">
              <label className="">Description:</label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-x-4 mt-2">
            <label className="">Top Package:</label>
            <select
                className="border border-slate-950 p-1"
                id="is_top_package"
                name="is_top_package"
                value={isTopPackage}
                onChange={handleInputChange}
            >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>
            </div>


            {/* Remove the image section */}

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

export default EditPackageModal
