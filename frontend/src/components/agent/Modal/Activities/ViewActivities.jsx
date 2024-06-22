import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchingActivities } from "../../../../redux/reducers/tourpackage/packageReducer";

const ViewActivitiesModal = ({ isOpen, onClose, packageId }) => {
  const dispatch = useDispatch();
  const activitiesPackage = useSelector((state) =>
    state.package.activities.filter((activity) => activity.activity_package === packageId)
  );

  useEffect(() => {
    if (packageId) {
      dispatch(handleFetchingActivities(packageId));
    }
  }, [dispatch, packageId]);

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div
        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-fit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-96 overflow-y-auto">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                Package Activities
              </h3>
              <div className="max-w-xl  p-8 mx-auto dark:bg-gray-100 dark:text-gray-800">
                <ul className="space-y-12 ">
                  {activitiesPackage.length === 0 ? (
                    <li className="flex items-start space-x-3">
                      <p className="text-sm">No activities added for this package yet.</p>
                    </li>
                  ) : (
                    activitiesPackage.map((activity) => (
                      <li key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between space-x-4 dark:text-gray-600">
                            <div className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300">
                              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gray-500 " /> {/* Placeholder for custom icon */}
                              <span className=" dark:text-gray-800">Day {activity.day}</span>
                            </div>
                            <span className="text-xs whitespace-nowrap">{/* Placeholder for timestamp */}</span>
                          </div>
                          <div>
                            <p className="text-wrap  break-all">{activity.description}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewActivitiesModal;