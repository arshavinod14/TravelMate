import React from "react";
import img from "../../assets/image1.jpg";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { handleSignup } from "../../redux/reducers/user/userReducer";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("Please enter first name"),
  last_name: Yup.string().required("Please enter last name"),
  phone: Yup.number()
    .test("is-mobile-number", "Invalid mobile number", (value) => {
      const mobileNumberPattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      return mobileNumberPattern.test(value);
    })
    .required("Mobile number is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter a valid email address"),

  password: Yup.string().required("Please enter a password"),
  //   confirmPassword: Yup.string()
  //     .oneOf([Yup.ref("password"), null], "Passwords must match")
  //     .required("Confirm password is required"),
});

const initialValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
};

export default function UserSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const loading = useSelector((s) => s.user.loading);
  const message = useSelector((s) => s.user.message);
  const error = useSelector((s) => s.user.error);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(handleSignup(values));
        if (response.error) {
          // Display an error message to the user
          console.log('Signup failed:', response.error);
        } else {
          // Navigate to the login page on successful signup
          navigate('/login');
          return toast.success("Registerd Successfully");
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error('An error occurred:', error);
      }
    },
  });

  return (
    <div className="relative w-full h-screen bg-zinc-900/90">
      <img
        className="absolute w-full h-full -z-10 object-cover mix-blend-overlay"
        src={img}
        alt="/"
      />

      <div className="flex justify-center items-center h-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="max-w-[400px] w-full mx-auto bg-white p-8 "
        >
          <h2 className="text-4xl font-bold text-center py-4">Sign Up</h2>
          <div className="flex justify-between py-8">
            {/* <p className="border shadow-lg hover:shadow-xl px-32 py-2 relative flex align items-center">
              <FcGoogle className="mr-2" />
              Google
            </p> */}
          </div>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <label className="flex flex-col mb-2">First Name</label>
              <input
                {...formik.getFieldProps("first_name")}
                className="border relative bg-gray-100 p-2 w-full mb-4"
                type="text"
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <span className="text-red-600">{formik.errors.first_name}</span>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <label className="flex flex-col mb-2">Last Name</label>
              <input
                {...formik.getFieldProps("last_name")}
                className="border relative bg-gray-100 p-2 w-full mb-4"
                type="text"
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <span className="text-red-600">{formik.errors.last_name}</span>
              )}
            </div>
          </div>

          <div>
            <label className="flex flex-col mb-2">Phone</label>
            <input
              {...formik.getFieldProps("phone")}
              className="border relative bg-gray-100  p-2 w-full mb-4"
              type="text"
            />
            {formik.touched.phone && formik.errors.phone && (
              <span className="text-red-600">{formik.errors.phone}</span>
            )}
          </div>

          <div>
            <label className="flex flex-col mb-2">Email</label>
            <input
              {...formik.getFieldProps("email")}
              className="border  relative bg-gray-100  p-2 w-full mb-4"
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
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-600">{formik.errors.password}</span>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <p className="text-center mt-8">
            Already a member?
            <Link to="/login" className="cursor-pointer text-blue-600">
              {" "}
              Sign In
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer
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
      />
    </div>
  );
}
