import React, { useState, useEffect } from "react";

const EditCategoryModal = ({ isOpen, category, onSubmit, onClose }) => {
  const [categoryName, setCategoryName] = useState(
    category?.name || ""
  );
  const [categoryDescription, setCategoryDescription] = useState(
    category?.description || ""
  );

  useEffect(() => {
    setCategoryName(category?.name || "");
    setCategoryDescription(category?.description || "");
     }, [category]); // Update state when category changes

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setCategoryName(value);
    } else if (name === "description") {
      setCategoryDescription(value);
    }
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
        id: category.id,
        name: categoryName,
        description: categoryDescription,
        
    };

    

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
          <h1 className="text-center text-3xl mb-10">Edit category</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-x-4 ">
              <label className="mr-4" htmlFor="name">
                Category Name:
              </label>
              <input
                className="border border-slate-950 p-1"
                type="text"
                id="name"
                name="name"
                value={categoryName}
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
                value={categoryDescription}
                onChange={handleInputChange}
              />
            </div>

            

            <div className="flex flex-row justify-between m-5">
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

export default EditCategoryModal;
