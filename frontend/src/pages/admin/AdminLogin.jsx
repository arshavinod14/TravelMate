import React from "react";
import img from "../../assets/image3.jpg";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { handleAdminLogin } from "../../redux/reducers/admin/adminReducer";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("please enter your email address")
    .trim()
    .required("This field is required"),
  password: Yup.string().trim().required("This field is required"),
});

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(handleAdminLogin(values)).then((response) => {
        console.log("admin", response);
        if (response.error) {
          console.log("rejected");
          return toast.error("Email or Password invalid!");
        }

        console.log("success");
        navigate("/admin/dashboard");
        return toast.success("Successfully logged in");
      })
    }
  })
  
  return (
    <div className="w-full h-screen flex">
      <div className="grid grid-cols-1 md:grid-cols-2 m-auto h-[550px] shadow-lg shadow-gray-600 sm:max-w-[900px]">
        <div className="w-full h-[550px] hidden md:block">
          <img className="w-full h-full" src={img} alt="/" />
        </div>
        <div className="p-4 flex flex-col justify-around">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-4xl font-bold text-center mb-16">
              Admin login
            </h2>

            <div className="mb-4">
              <input
                {...formik.getFieldProps("email")}
                className="border p-2 w-full"
                type="email"
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-600">{formik.errors.email}</span>
              )}
            </div>

            <div className="mb-4">
              <input
                {...formik.getFieldProps("password")}
                className="border p-2 w-full"
                type="password"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-600">{formik.errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 my-4 bg-green-600 hover:bg-green-500"
            >
              Login
            </button>
          </form>
        </div>
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
