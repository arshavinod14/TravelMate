import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ADMIN_AGENTS, ADMIN_FETCH_BOOKINGS, ADMIN_LOGIN, ADMIN_LOGOUT, ADMIN_USERS, AGENT_COUNT, BOOKING_TRENDS, BookingTrends, CATEGORY_DISTRIBUTION, FETCH_BOOKINGS, FETCH_CATEGORY, POPULAR_DESTINATIONS, REVENUE_TRENDS, USER_COUNT } from "../../../constant";
import { instance } from "../../api/axios";

export const handleAdminLogin = createAsyncThunk(
  "admin/login",
  async (payload) => {
    try {
      const response = await instance.post(ADMIN_LOGIN, payload);
      console.log("response-admin:",response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);


export const handleFetchingUsers = createAsyncThunk("users", async () =>{
  try {
    const response = await instance.get(ADMIN_USERS);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
})

export const handleFetchAgents = createAsyncThunk("agents",async () =>{
  try{
    const response = await instance.get(ADMIN_AGENTS);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error(error)
  }
})


export const handleFetchCategory = createAsyncThunk("category",async () =>{
  try{
    const response = await instance.get(FETCH_CATEGORY);
    console.log(response.data)
    return response.data
  }catch (error) {
    throw new Error(error)
  }
})

export const handleFetchBookings = createAsyncThunk("bookings",async ()=>{
  try{
    const response = await instance.get(FETCH_BOOKINGS)
    console.log(response.data)
    return response.data
  }catch (error) {
    throw new Error(error)
  }
})

export const handleAdminlogout = createAsyncThunk("admin/logout",async () => {
  try {
    const response = await instance.post(ADMIN_LOGOUT)
    localStorage.removeItem("adminTokens");
    return response.data;
    
  } catch (error) {
    throw new Error(error)
  }
})

export const handleBookingsTrends = createAsyncThunk("admin/bookings/trends",async () =>{
  try{
    const response = await instance.get(BOOKING_TRENDS)
    //console.log("bookings trends:",response.data)
    return response.data
  }catch (error) {
      throw new Error(error)
  }
})

export const handlePopularDestinations = createAsyncThunk("admin/popular/destinations",async ()=>{
  try{
      const response = await instance.get(POPULAR_DESTINATIONS)
      //console.log("popular destinations:",response.data)
      return response.data
  }catch (error) {
    throw new Error(error)
  } 
})

export const handleRevenueTrends = createAsyncThunk("admin/revenue/trends",async ()=>{
  try{
    const response = await instance.get(REVENUE_TRENDS)
    return response.data
  }catch (error) {
    throw new Error(error)
  }
})

export const handleCategoryDistribution = createAsyncThunk("admin/category",async ()=>{
  try{
    const response = await instance.get(CATEGORY_DISTRIBUTION)
    return response.data
  }catch (error) {
    throw new Error(error)
  }
})

const initialState = {
  loading: false,
  message: null,
  adminTokens: JSON.parse(localStorage.getItem("adminTokens")),
  destinations: null,
  users: [],
  agents:[],
  category:[],
  booking:[],
  bookingTrends: [],
  popularDestinations: [],
  revenueTrends: [],
  categoryDistribution:[],
};
const adminReducer = createSlice({
  name: "admin",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(handleAdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAdminLogin.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("adminTokens", JSON.stringify(action.payload?.token));
        state.adminTokens = action.payload?.token;
      })
      .addCase(handleAdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleFetchingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleFetchingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload
      })
      .addCase(handleFetchingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetch agents
      .addCase(handleFetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleFetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload
      })
      .addCase(handleFetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetch category
      .addCase(handleFetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleFetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(handleFetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //logout
      .addCase(handleAdminlogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAdminlogout.fulfilled, (state) => {
        state.loading = false;
        state.adminTokens = null; // Clear admin tokens from state
      })
      .addCase(handleAdminlogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(handleFetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleFetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(handleFetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(handleBookingsTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleBookingsTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingTrends = action.payload;
      })
      .addCase(handleBookingsTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handlePopularDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handlePopularDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.popularDestinations = action.payload;
      })
      .addCase(handlePopularDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(handleRevenueTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRevenueTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueTrends = action.payload;
      })
      .addCase(handleRevenueTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(handleCategoryDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleCategoryDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryDistribution = action.payload;
      })
      .addCase(handleCategoryDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default adminReducer.reducer;
