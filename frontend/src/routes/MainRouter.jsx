import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserTable from "../components/admin/UserTable";
import AgentTable from "../components/admin/AgentTable";
import DestinationTable from "../components/admin/DestinationTable";
import Homepage from "../pages/Homepage";
import AboutUs from "../pages/AboutUs";
import PackagePage from "../pages/PackagePage";

import DestinationDetail from "../pages/user/DestinationDetail";
import PackageDetails from "../components/user/package/PackageDetails";
import { useSelector } from "react-redux";
import UserAuth from "../pages/user/UserAuth";
import UserSignUp from "../pages/user/UserSignUp";
import UserLayout from "../pages/user/UserLayout";
import DestinationPage from "../pages/DestinationPage";
import AdminLogin from "../pages/admin/AdminLogin";
import AgentLogin from "../pages/agent/AgentLogin";
import AgentSignUp from "../pages/agent/AgentSignUp";
import AgentDash from "../pages/agent/AgentDash";
import AgentLayout from "../pages/agent/AgentLayout";
import PackageTable from "../components/agent/PackageTable";
import CategoriesTable from "../components/admin/CategoriesTable";
import UserProfile from "../components/user/UserProfile";
import BookingForm from "../pages/user/BookingForm";
import BookingsTable from "../components/agent/BookingsTable";
import BookingsDetails from "../components/admin/BookingsDetails";
import AgentProfile from "../pages/agent/AgentProfile";
import ContactUs from "../components/user/ContactUs";
import AppointmentBookedSuccessfully from "../pages/user/BookingSuccessful";
import Invoice from "../components/user/Invoice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notifications from "../components/admin/Notifications";
import NotFound from "../pages/NotFound";




const RequireAuth = ({ admintoken, children }) => {
  // Check if user is authenticated
  const isAuthenticated = !!admintoken;

  // If user is not authenticated, navigate to the login page
  if (!isAuthenticated) {
    return <Navigate to="adminlogin" />;
  }

  // If user is authenticated, render the children (admin dashboard)
  return children;
};

const RequireAuthAgent = ({ agenttoken, children }) => {
  // Check if user is authenticated
  const isAuthenticated = !!agenttoken;

  // If user is not authenticated, navigate to the login page
  if (!isAuthenticated) {
    return <Navigate to="agentlogin" />;
  }

  // If user is authenticated, render the children (admin dashboard)
  return children;
};

const AdminRouter = ({ admintoken }) => (
  <Routes>
    <Route path="/adminlogin" element={!admintoken ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} />
    <Route path="" element={<RequireAuth admintoken={admintoken}><AdminLayout /></RequireAuth>}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserTable />} />
      <Route path="agents" element={<AgentTable />} />
      <Route path="destinationsList" element={<DestinationTable />} />
      <Route path="categories" element={<CategoriesTable/>}/>
      <Route path="bookings" element={<BookingsDetails/>}/>
      <Route path="notifications" element={<Notifications/>}/>
    
    </Route>
  </Routes>
);

const AgentRouter = ({agenttoken}) => (
  <Routes>
      <Route path="/agentlogin" element={!agenttoken ? <AgentLogin />:<Navigate to="/agent/dashboard"/>} />
      <Route path="/register" element={<AgentSignUp/>} />
      <Route path="" element={<RequireAuthAgent agenttoken={agenttoken}><AgentLayout /></RequireAuthAgent>}>
        <Route path="dashboard" element={<AgentDash />} />
        <Route path="package" element={<PackageTable/>}/>
        <Route path="bookings" element={<BookingsTable/>} />
      <Route path="profile" element={<AgentProfile/>}/>
      
    </Route>
  </Routes>
);

const UserRouter = () => (
  <Routes>
    <Route element={<UserLayout />}>
      <Route path="/" element={<Homepage />} />
      <Route path="about-us" element={<AboutUs />} />
      <Route path="contact-us" element={<ContactUs/>}/>
      <Route path="listOfPackage" element={<PackagePage />} />
      <Route path="destinations-page" element={<DestinationPage />} />
      <Route path="destination-details/:id" element={<DestinationDetail />} />
      <Route path="package-details/:id" element={<PackageDetails />} />
      <Route path="booking" element={<BookingForm/>}/>
      <Route path="profile" element={<UserProfile/>}/>
      <Route path="success" element={<AppointmentBookedSuccessfully/>}/>
      <Route path="invoice" element={<Invoice/>}/>
    
      <Route path="*" element={<NotFound />} />

    </Route>
  </Routes>
);

export default function MainRouter() {
  const usertoken = useSelector((s) => s.user.authTokens);


  const admintoken = useSelector((s) => s.admin.adminTokens)


  const agenttoken=  useSelector((s) => s.agent.agentTokens)


  return (
    <Router>
      <Routes>
        <Route path="/login" element= {!usertoken ? <UserAuth /> : <Navigate to="/"  />}/>
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/admin/*" element={<AdminRouter admintoken={admintoken}/>} />
        <Route path="/agent/*" element={<AgentRouter agenttoken={agenttoken}/>} />
        <Route path="/*" element={<UserRouter />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
