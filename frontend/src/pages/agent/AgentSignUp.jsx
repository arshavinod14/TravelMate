import React from "react";
import img from "../../assets/image4.jpg";
import { Link,useNavigate} from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { handleAgentSignUp } from "../../redux/reducers/agent/agentReducer";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';


const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("please enter first name"),
  last_name: Yup.string().required("please enter last name"),
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
})

const initialValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: ""
}

export default function AgentSignUp() {
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
        const response = await dispatch(handleAgentSignUp(values));
        if (response.error) {
          console.log('Signup failed:', response.error);
          return toast.error("Signup failed")
        } else {
          navigate('/agent/agentlogin');
          return toast.success("Registerd Successfully");
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
  });

  return (
    <div className="w-full h-screen flex">
      <div className="grid grid-cols-1 md:grid-cols-2 m-auto h-[550px] shadow-lg shadow-gray-600 sm:max-w-[900px]">
        <div className="w-full h-[550px] hidden md:block">
          <img className="w-full h-full" src={img} alt="/" />
        </div>
        <div className="p-4 flex flex-col justify-around">
          <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}>
            <h2 className="text-4xl font-bold text-center mb-16">
              Agent SignUp
            </h2>

            <div className="mb-4">
              <input
              {...formik.getFieldProps("first_name")}
                className="border p-2 w-full"
                type="text"
                placeholder="First Name"
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <span className="text-red-600">{formik.errors.first_name}</span>
              )}
            </div>

            <div className="mb-4">
              <input
               {...formik.getFieldProps("last_name")}
                className="border p-2 w-full"
                type="text"
                placeholder="Last Name"
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <span className="text-red-600">{formik.errors.last_name}</span>
              )}
            </div>

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
              {...formik.getFieldProps("phone")}
                className="border p-2 w-full"
                type="text"
                placeholder="Phone"
              />
              {formik.touched.phone && formik.errors.phone && (
              <span className="text-red-600">{formik.errors.phone}</span>
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

            <button className="w-full py-2 my-4 bg-green-600 hover:bg-green-500">
              Register
            </button>
          </form>
          <p className="text-center mb-16 font-medium underline"><Link to="/agent/agentlogin">Already a Member? SignIn</Link></p>
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
