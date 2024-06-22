import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';

// import {
//   Navigate,
//   RouterProvider,
//   createBrowserRouter,
// } from "react-router-dom";
// // import { User } from "./components/User";
// import { Auth } from "./pages/Auth";
// import UserAuth from "./pages/user/UserAuth";
// import AgentLogin from "./pages/agent/AgentLogin";
// import AdminLogin from "./pages/admin/AdminLogin";
// import UserSignUp from "./pages/user/UserSignUp";
// import AgentSignUp from "./pages/agent/AgentSignUp";
// import { Provider, useSelector } from "react-redux";
import store from "./redux/store/store";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import DestinationDetail from "./pages/user/DestinationDetail";
// import Details from "./components/user/package/PackageDetails";
// import Homepage from "./pages/Homepage";
// import AdminLayout from "./pages/admin/AdminLayout";
// import UserTable from "./components/admin/UserTable";
// import AgentTable from "./components/admin/AgentTable";
// import AgentDash from "./pages/agent/AgentDash";
// import AgentLayout from "./pages/agent/AgentLayout";
// import Package from "./pages/agent/Package";
// import AboutUs from "./pages/AboutUs";
// import PackagePage from "./pages/PackagePage";
// import DestinationPage from "./pages/DestinationPage";
// import DestinationTable from "./components/admin/DestinationTable";
// import PackageDetails from "./components/user/package/PackageDetails";



// export default function MainRouter(){

  // const userAccess = JSON.parse(localStorage.getItem("adminTokens"));
// console.log("ddd:",localStorage.getItem("adminTokens"))

// const userAccess = useSelector((s)=>JSON.parse(s.adminTokens))
// console.log("ddd:",userAccess)

// const router = createBrowserRouter([
  
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <Homepage />,
//       },
//       {
//         path: "about-us",
//         element: <AboutUs />,
//       },
//       {
//         path: "listOfPackage",
//         element: <PackagePage />,
//       },
//       {
//         path: "destinations",
//         element: <DestinationPage />,
//       },
//       {
//         path: "destination-details/:id",
//         element: <DestinationDetail />,
//       },
//       {
//         path: "package-details/:id",
//         element: <PackageDetails />,
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Auth />,
//     children: [
//       {
//         // path: "user",
//         index: true, //setting this component as default - login
//         element: userAccess ? <Navigate to="/dashboard/admin" /> : <UserAuth />,
//       },
//       {
//         path: "agent",
//         element: <AgentLogin />,
//       },
//       {
//         path: "admin",
//         element:userAccess ? <Navigate to="/dashboard/admin" /> : <AdminLogin />,
//         // element:<AdminDashboard/>
//       },
//     ],
//   },
//   {
//     path: "/register",
//     element: <Auth />,
//     children: [
//       {
//         index: true,
//         element: <UserSignUp />,
//       },
//       {
//         path: "agent",
//         element: <AgentSignUp />,
//       },
//     ],
//   },
//   {
//     path: "/dashboard",
//     element: <Auth />,
//     children: [
//       {
//         path: "admin",
//         element: <AdminLayout />,
//         children: [
//           {
//             index: true,
//             element: !userAccess ? (
//               <Navigate to="/login/admin" />
//             ) : (
//               <AdminDashboard />
//             ),
//           },
//           {
//             path: "users",
//             element: 
//               <UserTable />
//             ,
//           },
//           {
//             path: "agents",
//             element: !userAccess ? (
//               <Navigate to="/login/admin" />
//             ) : (
//               <AgentTable />
//             ),
//           },
//           {
//             path: "destinationsList",
//             element: !userAccess ? (
//               <Navigate to="/login/admin" />
//             ) : (
//               <DestinationTable />
//             ),
//           },
//         ],
//       },
//       {
//         path: "agent",
//         element: <AgentLayout />,
//         children: [
//           {
//             index: true,
//             element: <AgentDash />,
//           },
//           {
//             path: "package",
//             element: <Package />,
//           },
//         ],
//       },
//     ],
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
 
    <App />
  
</Provider>
);