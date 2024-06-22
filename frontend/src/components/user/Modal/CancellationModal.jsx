import React from 'react';

function CancellationModal({ isOpen, onClose, onConfirm }) {
  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
        <p className="mb-4">Are you sure you want to cancel this booking?</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-semibold mr-4">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default CancellationModal;
