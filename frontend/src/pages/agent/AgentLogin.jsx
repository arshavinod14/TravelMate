import React from "react";
import img from "../../assets/image4.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"
import { useDispatch } from "react-redux";
import { handleAgentLogin } from "../../redux/reducers/agent/agentReducer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").trim().required("This field is required"),
  password: Yup.string().trim().required("Please enter a valid password")

})
export default function AgentLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues:{
      email:"",
      password:"",
    },
    validationSchema,
    onSubmit:(values) =>{
        console.log(values)
        dispatch(handleAgentLogin(values)).then((response)=>{
          console.log("agent response:",response)
          if(response.error){
            console.log("rejected")
            return toast.error("Email or Password invalid!");
          }
          console.log("Success");
          navigate("/agent/dashboard");
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
          <form
          onSubmit={formik.handleSubmit}
          >
            <h2 className="text-4xl font-bold text-center mb-16">
              Agent login
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
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-600">{formik.errors.email}</span>
              )}
            </div>

            <button type="submit" className="w-full py-2 my-4 bg-green-600 hover:bg-green-500">
              Login
            </button>

            <p className="text-center mt-2">Forgot Password?</p>
          </form>
          <Link to="/agent/register"><p className="text-center font-medium underline mb-16">Register</p></Link>
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
