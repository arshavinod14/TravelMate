import React from "react";
import img from "../../assets/image1.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleLogin } from "../../redux/reducers/user/userReducer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("please enter a valid email address")
    .trim()
    .required("This field is required"),
  password: Yup.string().trim().required("This field is required"),
});

const UserAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
  console.log(values);
  dispatch(handleLogin(values)).then((response) => {
    console.log("response from userauth", response);
    if (response && response.error) {
      console.log("rejected", response.error);
      toast.error("Email or Password invalid!");
    } else {
      console.log("Success", response);
      toast.success('Logged in successfully');
      navigate("/");
    }
  });
},
  });
  return (
    // <div className='w-max-[28rem] flex flex-col items-center justify-center'>
    //     <span className='text-4xl font-bold'>Sign in</span>

    // </div>
    <>
    
      <div className="relative w-full h-screen bg-zinc-900/90">
      
        <img
          className="absolute w-full -z-10 h-full object-cover mix-blend-overlay"
          src={img}
          alt="/"
        />
        

        <div className="flex justify-center items-center h-full">
        
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-[400px] w-full mx-auto bg-white p-8 "
          >
            <h2 className="text-4xl font-bold text-center py-4">Sign In</h2>
            {/* <div className="flex justify-between py-8">
              <p className="border shadow-lg hover:shadow-xl px-32 py-2 relative flex align items-center">
                <FcGoogle className="mr-2" />
                Google
              </p>
            </div> */}
            <div>
              <label className="flex flex-col mb-2">Email</label>

              <input
                {...formik.getFieldProps("email")}
                className="border relative bg-gray-100  p-2 w-full mb-4"
                type="email"
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-600">{formik.errors.email}</span>
              )}
            </div>

            <div>
              <label className="flex flex-col">Password</label>
              <input
                {...formik.getFieldProps("password")}
                className="border relative bg-gray-100  p-2 w-full mt-2"
                type="password"
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-600">{formik.errors.password}</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white"
            >
              Sign In
            </button>
            <p className="flex items-center mt-2">
              <input className="mr-2" type="checkbox" />
              Remember me
            </p>
            <p className="text-center mt-8">
              Not a member?{" "}
              <NavLink to="/signup" className="text-blue-600">
                Sign up
              </NavLink>{" "}
              now!
            </p>
          </form>
        </div>
      </div>
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="my-toast-container"
      /> */}
       {/* <ToastContainer /> */}
    </>
  );
};

export default UserAuth;
