import React, { useEffect, useState } from 'react';

const DeleteCategoryModal = ({ isOpen, onConfirm, onClose, categoryIdToDelete,category }) => {
    console.log("category from delete: " + category)
    return (
      <div className={`fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 px-4 py-6 sm:px-0 sm:py-8 ${!isOpen && 'hidden'}`}>
        <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="modal-header flex items-center justify-between py-4 px-5 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-700">Confirm Deletion</h4>
            <button type="button" onClick={onClose} className="text-gray-400 focus:outline-none hover:text-gray-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10L4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="modal-body p-6 text-center">
      {categoryIdToDelete && ( // Check if categoryId exists before displaying
        <p className="text-sm text-gray-700">
          Are you sure you want to delete category: {category.name}?
        </p>
      )}
    </div>
          <div className="modal-footer flex items-center justify-center py-4 border-t border-gray-200">
            <button type="button" className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400" onClick={onConfirm} >
              Delete
            </button>
            <button type="button" className="px-4 py-2 ml-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

export default DeleteCategoryModal;

