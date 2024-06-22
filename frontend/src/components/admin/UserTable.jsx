import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchingUsers } from "../../redux/reducers/admin/adminReducer";
import { FaSpinner } from "react-icons/fa";

const UserListRow = ({ email, first_name, last_name, phone }) => {
  return (
    <tr className="hover:bg-gray-50">
      <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
        <div className="relative h-10 w-10">
          <img
            className="h-full w-full rounded-full object-cover object-center"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-700">
            {first_name.concat(" " + last_name)}
          </div>
          <div className="text-gray-400">{email}</div>
        </div>
      </th>
      {/* <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
          Active
        </span>
      </td> */}
      <td className="px-6 py-4">{phone}</td>
      {/* <td className="px-6 py-4"> */}
        {/* Action buttons */}
      {/* </td> */}
    </tr>
  );
};

export default function UserTable() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.admin?.loading);
  const users = useSelector((s) => s.admin?.users);
  console.log("uuuuu", users);

  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    dispatch(handleFetchingUsers());
  }, []);

  const filteredUsers = users?.user?.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.phone}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-75">
        <FaSpinner className="text-4xl text-gray-800 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="">
      <header className=" border-b-4 border-indigo-600 w-screen">
        <input
          className="w-full py-4 px-6 rounded-md pl-2 outline-none focus:outline-none active:outline-none"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      <div className="mt-10">
      {(!users || users.length === 0) ? (
          <p>No Users found.</p>
        ) : (
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Name
              </th>
              {/* <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                State
              </th> */}
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Phone Number
              </th>
              {/* <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredUsers.map((user) => (
              <UserListRow key={user.id} {...user} />
            ))}
          </tbody>
        </table>
           )}
      </div>
    </div>
  );
}
