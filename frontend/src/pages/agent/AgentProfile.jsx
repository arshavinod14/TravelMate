import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import { handleAgentIdDetails, handleChangePassword, handleGetAgentPackages } from '../../redux/reducers/agent/agentReducer';
import defaultImg from '../../assets/default_person.png'

function AgentProfile() {
    const dispatch = useDispatch();
    const loading = useSelector((s) => s.user.loading);
    const access = useSelector((s) => s.user.authTokens?.access);
  
    const agent = useSelector((state) => state?.agent?.agents);
    console.log("cust:", agent);
    const bookings = useSelector((state) => state?.user?.bookings);
    const packages = useSelector((state) => state.package?.packages);
     
    console.log("package::",packages)
  
    const [showPasswordChange, setShowPasswordChange] = useState(true); // Change default state to true
    const [showBookings, setShowBookings] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null); // State to track the selected booking for cancellation
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

    const getAgentIdFromToken = () => {
        try {
          const tokenJSON = localStorage.getItem("agentTokens");
          const tokenObject = JSON.parse(tokenJSON);
          const accessToken = tokenObject.access;
          const decodedToken = jwt_decode(accessToken);
          const agentId = decodedToken.id;
          
          return agentId;
        } catch (error) {
          console.error("Error retrieving agent ID from token:", error);
          return null;
        }
      };
    
      const agentId = getAgentIdFromToken();
      console.log("agentId: " + agentId)

      useEffect(() => {
        dispatch(handleAgentIdDetails(agentId));
      }, [agentId]);
    
  

  
    const handlePasswordChangeClick = async () => {
      try {
        // Dispatch the async thunk to initiate password change
        const result = await dispatch(handleChangePassword({ id: agentId, oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword }));
  
        if (result.payload.success) {
          // Password change was successful
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setShowPasswordChange(true);
          setShowBookings(false);
  
          dispatch(handleAgentIdDetails(agentId));
  
          toast.success('Password changed successfully!');
        } else {
          // Password change failed
          toast.error(result.payload.error || 'Failed to change password. Please try again.');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        toast.error('Failed to change password. Please try again.');
      }
    };
  

   
    
  
    if (!agent) {
      return (
        <div className="w-screen h-screen flex justify-center items-center">
          <h1 className="text-2xl text-gray-200 font-semibold">Loading.....</h1>
        </div>
      );
    }
  
    return (
        <div className="">
          <section className="text-gray-600 body-font w-screen ">
            <div className="container px-10 py-36 flex flex-col bg-white">
              <div className="lg:w-4/6 mx-auto flex flex-row">
                <div className="flex flex-col sm:flex-row mt-20">
                  <div className="sm:w-full text-center sm:pr-8 sm:py-8">
                    <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={defaultImg}
                        alt="userphoto"
                      />
                    </div>
                    <div className="flex flex-col items-center text-center justify-center">
                      <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                        {agent?.first_name} {agent?.last_name}
                      </h2>
                      <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                      <p>{agent?.phone}</p>
                      <p className="text-base">{agent?.email}</p>
                    </div>
                  </div>
                </div>
      
                {/* Change Password */}
                {showPasswordChange && (
                  <div className="ml-auto">
                    <PasswordChangeComponent
                      oldPassword={oldPassword}
                      newPassword={newPassword}
                      confirmPassword={confirmPassword}
                      setOldPassword={setOldPassword}
                      setNewPassword={setNewPassword}
                      setConfirmPassword={setConfirmPassword}
                        handlePasswordChange={handlePasswordChangeClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
      
          <ToastContainer />
        </div>
      );
  }
  
  function PasswordChangeComponent({ oldPassword,newPassword,confirmPassword, setNewPassword,setOldPassword,setConfirmPassword, handlePasswordChange }) {
      console.log("oldPassword: " + oldPassword)
    return (
      <div className="container px-5 py-24 mr-20">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <div>
        <label className='m-3'>Old Password:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        </div>
        <div>
      <label className='m-3'>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        </div>
        <div>
        <label className='m-3'>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        </div>
        <div>
  
        <button
          onClick={handlePasswordChange}
          className="bg-indigo-500 text-white px-6 py-2 rounded-md"
        >
          Change Password
        </button>
        </div>
      </div>
    );
  }

  

export default AgentProfile