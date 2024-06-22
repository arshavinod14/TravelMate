import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchCategory } from "../../redux/reducers/admin/adminReducer";
import { handleFetchingPackages } from "../../redux/reducers/tourpackage/packageReducer";
import { Link } from "react-router-dom";

function CategoryFilter() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.admin?.category);
  const packages = useSelector((state) => state.package?.packages);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    dispatch(handleFetchCategory());
    dispatch(handleFetchingPackages());
  }, []);

  const filterPackagesByCategory = (categoryId) => {
    console.log("Selected category ID (filter function):", categoryId);
    if (!categoryId) return packages; // Show all packages if no category selected
    const filtered = packages.filter((packages) => packages.category === categoryId);
    console.log("Filtered packages (filter function):", filtered);
    return filtered;
  };

  const handleButtonClick = (categoryId) => {
    console.log("Selected category ID:", categoryId);
    setSelectedCategoryId(categoryId);
  };

  
  const findAvailableCategoryId = () => {
    if (categories.length > 0) {
      return categories[0].id; // Default to first category
    } else {
      // Attempt to find the next available category ID
      for (let i = 1; i < categories.length; i++) {
        if (categories[i]) { // Check if category exists at this index
          return categories[i].id;
        }
      }
    }
    return null; 
  };

  useEffect(() => {
    const availableCategoryId = findAvailableCategoryId();
    setSelectedCategoryId(availableCategoryId);
  }, [categories]); 
  const filteredPackages = filterPackagesByCategory(selectedCategoryId);

  return (
    <>
      <div className="flex flex-col m-14 mt-5 ">
        <h1 className="text-4xl font-bold pb-10">Packages by Interest</h1>

        <div className="flex mb-4">
        
          {categories.map((category) => (
            <button
              key={category.id}
              className={`border font-normal py-2 px-4 mr-2 rounded-3xl 
                 ${selectedCategoryId === category.id ? 'border-orange-500 text-orange-500' : ''}`}
              onClick={() => handleButtonClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex mb-4 flex-wrap">
  {/* Cards for packages */}
  {filteredPackages.length > 0 ? (
    filteredPackages.map((packages) => (
      <Link to={`/package-details/${packages.id}`}>
      <div
        key={packages.id}
        className="flex items-center  w-full m-10" 
      >
        <img
          src={packages.image}
          alt={packages.package_name} 
          className=" w-28 h-20 rounded-lg" 
        />
        <div className="pl-5">
          <h2 className="text-lg ">{packages.package_name}</h2>
          <p className="text-sm">Duration : {packages.duration} Days</p>
        </div>
      </div>
      </Link>
    ))
  ) : (
    <p>
      {categories.length === 0 ? (
        "No categories available yet."
      ) : (
        "No packages found in this category."
      )}
    </p>
  )}
</div>

      </div>
    </>
  );
}

export default CategoryFilter;
