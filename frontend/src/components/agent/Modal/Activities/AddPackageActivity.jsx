import React, { useState } from 'react';

const AddPackageActivityModal = ({ isOpen, packageId, onSubmit, onClose }) => {
  const [activities, setActivities] = useState([{ day: '', description: '' }]);

  const handleAddActivity = () => {
    setActivities([...activities, { day: '', description: '' }]);
  };

  const handleRemoveActivity = (index) => {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(activities);
  };

  const handleChange = (index, key, value) => {
    const newActivities = [...activities];
    newActivities[index][key] = value;
    setActivities(newActivities);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">Add Package Activities</h2>
          <form onSubmit={handleSubmit}>
            {activities.map((activity, index) => (
              <div key={index} className="mb-4">
                <label htmlFor={`day-${index}`} className="block font-medium mb-2">
                  Day
                </label>
                <input
                  type="number"
                  id={`day-${index}`}
                  value={activity.day}
                  onChange={(e) => handleChange(index, 'day', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  required
                />
                <label htmlFor={`description-${index}`} className="block font-medium mb-2 mt-4">
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  value={activity.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveActivity(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddActivity} className="bg-blue-500 text-white hover:bg-blue-700 rounded-md px-4 py-2">
              Add Activity
            </button>
            <button type="submit" className="bg-violet-500 text-white hover:bg-violet-700 rounded-md px-4 py-2 ml-2">
              Save
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackageActivityModal;
