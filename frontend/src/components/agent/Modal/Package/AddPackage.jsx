import React, { useState, useEffect } from "react";
import { handleFetchingDestination } from "../../../../redux/reducers/destination/destinationReducer";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchCategory } from "../../../../redux/reducers/admin/adminReducer";


const AddPackageModal = ({ isOpen, onSubmit, onClose,agentId }) => {
  const [destinationId, setDestinationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destination?.destinations);
  //console.log("destinations from package", destinations);

  const category = useSelector((state) => state.admin?.category);
  
  useEffect(() => {
    if (isOpen) {
      dispatch(handleFetchingDestination());
      dispatch(handleFetchCategory());
    }
  }, [dispatch, isOpen]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "destination_id") {
      setDestinationId(value);
    } else if (name === "category") {
      setCategoryId(value);
    } else if (name === "package_name") {
      setPackageName(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "duration") {
      setDuration(value);
    } else if (name === "price") {
      setPrice(value);
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


  
    const formData = new FormData();
    formData.append("agent_id", agentId);
    formData.append("destination_id", destinationId.toString());
    formData.append("category", categoryId);
    formData.append("package_name", packageName.toString());
    formData.append("description", description);
    formData.append("duration", duration.toString());
    formData.append("price", price.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }
  
    console.log("Form Data:", formData);

    const formDataObject = Object.fromEntries(formData);
  console.log("Form Data Object:", formDataObject);
  
    
    await onSubmit(formData);
    
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out">
        <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-sm p-10 ">
          <h1 className="text-center text-3xl mb-10">Add Package</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-4">
              <label htmlFor="destination">Destination:</label>
              <select
                className="border border-slate-950 p-1 "
                id="destination"
                name="destination_id"
                value={destinationId}
                onChange={handleInputChange}
              >
                <option value="">Select Destination</option>
                {destinations.map((destination) => (
                  <option
                    className=" text-black hover:text-white"
                    key={destination.id}
                    value={destination.id}
                  >
                    {destination.destination_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-x-4">
              <label htmlFor="category">Category:</label>
              <select
                className="border border-slate-950 p-1 "
                id="category"
                name="category"
                value={categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {category.map((cat) => (
                  <option
                    className=" text-black hover:text-white"
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-x-4">
              <label htmlFor="packageName">Package Name:</label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="packageName"
                name="package_name"
                value={packageName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-x-4">
              <label htmlFor="description">Description:</label>
              <textarea
                className="border border-slate-950"
                id="description"
                name="description"
                value={description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="grid gap-x-4">
              <label htmlFor="duration">Duration (in days):</label>
              <input
                className="border border-slate-950 p-1"
                type="number"
                id="duration"
                name="duration"
                value={duration}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-x-4">
              <label htmlFor="price">Price:</label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="price"
                name="price"
                value={price}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-x-4">
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

export default AddPackageModal;
