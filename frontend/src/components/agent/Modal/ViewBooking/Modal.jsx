import React from 'react';

const Modal = ({ show, onClose, onApprove, onDecline }) => {
  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
            <p className="mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                onClick={onApprove}
              >
                Approve
              </button>
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2 m-1"
                onClick={onDecline}
              >
                Decline
              </button>
              <button
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 m-1"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;