import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instance } from "../../api/axios";
import { ADD_REVIEWS, BOOKING, CANCEL_BOOKING, CHANGE_PASSWORD, CONTACT_US, GET_BOOKINGS, GET_BOOKING_DETAILS, GET_CUSTOMER, LOGIN, LOGOUT, NOTIFICATION, REGISTER, VIEW_ACTIVITIES, VIEW_ALL_REVIEWS, VIEW_REVIEWS } from "../../../constant";

export const handleSignup = createAsyncThunk("user/signup", async (payload) => {
  try {
    const response = await instance.post(REGISTER, payload);

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});

export const handleLogin = createAsyncThunk("user/login", async (payload) => {
  try {
    const response = await instance.post(LOGIN, payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});

export const handleCustomerLogout = createAsyncThunk("logout",async()=>{
  try {

    const response = await instance.post(LOGOUT)
    return response.data
    
  } catch (error) {
    return Promise.reject(error);
  }
})

export const handleFetchCustomerDetails = createAsyncThunk("userDetails", async(id) =>{
  try {
    const response = await instance.get(GET_CUSTOMER + id);
    return response.data
  } catch (error) {
    return Promise.reject(error);
  }
})

export const handleContactMessage = createAsyncThunk(
  "contact/handleContactMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await instance.post(CONTACT_US, messageData);
      return response.data;
    } catch (error) {
      // Handle error
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleChangePassword = createAsyncThunk("user/password", async ({ id, oldPassword, newPassword, confirmPassword }) => {
  try {
    const url = CHANGE_PASSWORD.replace(":id", id);
    const response = await instance.put(url, { old_password: oldPassword, new_password1: newPassword, new_password2: confirmPassword });
    console.log("response from pass:", response);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const handleBooking = createAsyncThunk("user/package/booking",async (formData)=>{
  try{
      const response = await instance.post(BOOKING,formData)
      console.log("booking response:",response)
      return response.data
  }catch(error){
      return Promise.reject(error)
  }
})

export const handleGetBookings = createAsyncThunk("user/bookings", async(id) =>{
  try {
    const url = GET_BOOKINGS.replace(":id", id);
    const response =  await instance.get(url);
    console.log("bookings response:",response)
    return response.data
  } catch (error) {
    return Promise.reject(error);
  }
})

export const handleBookingDetails = createAsyncThunk("user/bookingDetails",async (id)=>{
  try{
    console.log("hellloe from bookings")
    const url = GET_BOOKING_DETAILS.replace(":id",id)
    const response = await instance.get(url);
    console.log("bookings response:",response)
    return response.data
  }catch(error){
    return Promise.reject(error);
  }
})

export const handleCancelBookings = createAsyncThunk(
  'user/bookings/cancel',
  async (bookingId) => {
    try {
      const url = CANCEL_BOOKING.replace(":id",bookingId);
      const response = await instance.put(url);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const handleAddReviews = createAsyncThunk('user/package/postreviews',async(formData) =>{
  try{
    const response = await instance.post(ADD_REVIEWS,formData)
    return response.data
}catch(error){
    return Promise.reject(error)
}
})



export const handleViewReviews = createAsyncThunk('user/package/reviews',async(packageId) =>{
    try{
    const url = VIEW_REVIEWS.replace(":id",packageId)
    const response = await instance.get(url);
    return response.data
}catch (error) {
  return Promise.reject(error);

}})

export const handleAllReviews = createAsyncThunk('user/package/allreviews',async(formData) =>{
  console.log("helllo from all review")
  try{
    const response = await instance.get(VIEW_ALL_REVIEWS,formData)
    console.log("review response:",response)
    return response.data
}catch(error){
    return Promise.reject(error)
}
});


// export const handleNotifications = createAsyncThunk('notification',async()=>{
//   try{
//     const response = await instance.get(NOTIFICATION)
//     return response.data
//   }catch(error){
//     return Promise.reject(error)
//   }
// })



const initialState = {
  loading: false,
  message: "",
  authTokens: JSON.parse(localStorage.getItem("authTokens")),
  userDetails: {},
  bookings:[],
  reviews:[],
  notification_items:[],
  error: null,
};
const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    
  }, //not asynchronous - manages the state of frontend
  //asynchronous
  extraReducers: (builder) => {
    builder
      .addCase(handleSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(handleSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(handleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.authTokens = action.payload.token;
        localStorage.setItem("authTokens", JSON.stringify(action.payload.token));
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //logout
      .addCase(handleCustomerLogout.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(handleCustomerLogout.fulfilled,(state, action)=>{
        state.loading = false;
        state.authTokens = null;
        localStorage.removeItem("authTokens")
      })
      .addCase(handleCustomerLogout.rejected,(state,action)=>{
          state.loading = false;
          state.error = action.error.message
      })

      //fetch customer
      .addCase(handleFetchCustomerDetails.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(handleFetchCustomerDetails.fulfilled,(state, action)=>{
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(handleFetchCustomerDetails.rejected,(state,action)=>{
          state.loading = false;
          state.error = action.error.message
      })

      //password
      .addCase(handleChangePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleChangePassword.fulfilled, (state, action) => {
        state.loading = false;
       // state.authTokens = action.payload.tokens; // Update auth tokens
        state.userDetails = action.payload; // Update user details
      })
      .addCase(handleChangePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Extract error message
      })

      //contactus
      .addCase(handleContactMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(handleContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.error;
      })

      .addCase(handleBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.bookings.push(action.payload.data); // Push the new booking to the bookings array
      })
      .addCase(handleBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(handleGetBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGetBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(handleGetBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(handleCancelBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleCancelBookings.fulfilled, (state, action) => {
        state.loading = false;
        const { bookingId, status } = action.payload; // Assuming the payload contains the updated booking ID and status
        const updatedBookingIndex = state.bookings.findIndex(booking => booking.id === bookingId);
        if (updatedBookingIndex !== -1) {
          state.bookings[updatedBookingIndex].status = status; // Update the status of the cancelled booking
        }
      })
      .addCase(handleCancelBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Error message from the rejection
      })

      //fetch booking details
      .addCase(handleBookingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(handleBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetch review details
      .addCase(handleViewReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleViewReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(handleViewReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //add review details
      .addCase(handleAddReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAddReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload); 
      })
      .addCase(handleAddReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //view all reviews
      .addCase(handleAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(handleAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // .addCase(handleNotifications.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(handleNotifications.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.notification_items = action.payload;
      // })
      // .addCase(handleNotifications.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // });
  },
});

export default userReducer.reducer;
