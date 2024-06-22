import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchCategory } from "../../redux/reducers/admin/adminReducer";
import AddCategoryModal from "./Modal/CategoryModal/AddCategory";
import { handleAddCategory, handleDeleteCategory, handleEditCategory } from "../../redux/reducers/category/categoryReducer";
import EditCategoryModal from "./Modal/CategoryModal/EditCategory";
import DeleteCategoryModal from "./Modal/CategoryModal/DeleteCategory";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from "react-icons/fa";

function CategoriesTable() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.admin?.category);
  const loading = useSelector((state) => state.admin?.loading);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [category, setCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(handleFetchCategory());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (category) => {
    setIsEditModalOpen(true);
    setCategoryId(category.id);
    setCategory(category);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCategoryId(null);
    setCategory(null);
  };

  const handleOpenDeleteModal = (category) => {
    setIsDeleteModalOpen(true);
    setCategoryIdToDelete(category.id);
    setCategory(category);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryId(null);
    setCategoryIdToDelete(null);
  };

  const handleAddSubmit = async (formData) => {
    try {
      await dispatch(handleAddCategory(formData));
      dispatch(handleFetchCategory());
      handleCloseAddModal();
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category. Please try again.');
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await dispatch(handleEditCategory({ id: category.id, formData }));
      dispatch(handleFetchCategory());
      handleCloseEditModal();
      toast.success('Category edited successfully');
    } catch (error) {
      console.error('Error editing category:', error);
      toast.error('Failed to edit category. Please try again.');
    }
  };

  const handleDeleteSubmit = async () => {
    if (categoryIdToDelete) {
      try {
        await dispatch(handleDeleteCategory(categoryIdToDelete));
        handleCloseDeleteModal();
        dispatch(handleFetchCategory());
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-gray-800 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div>
      <header className="border-b-4 border-indigo-600 w-screen">
        <input
          className="w-full py-4 px-6 rounded-md pl-2 outline-none focus:outline-none active:outline-none"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </header>
      <button
        type="button"
        className="text-white bg-violet-500 hover:bg-violet-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 ml-2 mb-4 mt-4"
        onClick={handleOpenAddModal}
      >
        Add Category
      </button>

      {isAddModalOpen && (
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onSubmit={handleAddSubmit}
          onClose={handleCloseAddModal}
        />
      )}

      {isEditModalOpen && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          category={category}
          onSubmit={handleEditSubmit}
          onClose={handleCloseEditModal}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          category={category}
          categoryIdToDelete={categoryIdToDelete}
          onConfirm={handleDeleteSubmit}
          onClose={handleCloseDeleteModal}
        />
      )}

      {loading && <p>Loading...</p>}
      {categories.length === 0 && !loading && <p>No Categories found</p>}
      {categories.length > 0 && (
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Category Name
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Description
              </th>
              <th scope="col" className="px-6 py-4 pl-16 font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((cat) => (
              <tr key={cat.id}>
                <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 px-6 py-12">
                      {cat.name}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{cat.description}</td>
                <td className="px-6 py-4 flex">
                  <button
                    type="button"
                    className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-2"
                    onClick={() => handleOpenEditModal(cat)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-2"
                    onClick={() => handleOpenDeleteModal(cat)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex  mt-4 mb-2 justify-center mr-56 ">
        {Array.from({ length: Math.ceil(filteredCategories.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoriesTable;
