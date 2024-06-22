import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AGENT_BOOKINGS, AGENT_CATEGORY_DISTRIBUTION, AGENT_CHANGE_PASSWORD, AGENT_ID_DETAILS, AGENT_LOGIN, AGENT_LOGOUT, AGENT_PACKAGES, AGENT_POPULAR_DESTINATIONS, AGENT_REGISTER, AGENT_REVENUE, NOTIFICATION, POPULAR_DESTINATIONS } from "../../../constant";
import { instance } from "../../api/axios";

export const handleAgentSignUp = createAsyncThunk(
  "agent/signup",
  async (payload) => {
    try {
      const response = await instance.post(AGENT_REGISTER, payload);
    
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const handleAgentLogin = createAsyncThunk(
  "agent/login",
  async (payload) => {
    try {
      const response = await instance.post(AGENT_LOGIN, payload);
    
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const handleAgentIdDetails = createAsyncThunk(
  "agent/id/details",
  async (id) => {
    try {
      const url = AGENT_ID_DETAILS.replace(":id", id); // Replace :id with actual agent ID
      const response = await instance.get(url); // Fetch agent details using GET request
      
      if (response.status === 200) {
        return response.data; // Return agent details if request is successful
      } else {
        throw new Error('Failed to fetch agent details');
      }
    } catch (error) {
      throw new Error(error); // Throw error if request fails
    }
  }
);

export const handleGetAgentPackages = createAsyncThunk("agent/get/packages", async(id) =>{
  try {
    const url = AGENT_PACKAGES.replace(":id", id);
    const response =  await instance.get(url);
    return response.data
  } catch (error) {
    return Promise.reject(error);
  }
})

export const handleGetBookings  = createAsyncThunk("agent/get/bookings",async(id)=>{
  try {
    const url = AGENT_BOOKINGS.replace(":id", id);
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
})

export const handleApproveBooking = createAsyncThunk(
  'agent/approveBooking',
  async ({ agentId, bookingId }, { rejectWithValue }) => {
    try {
  
      const response = await instance.put(`/api/agent/${agentId}/bookings/${bookingId}/`, { action: 'approve' });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleDeclineBooking = createAsyncThunk(
  'agent/declineBooking',
  async ({ agentId, bookingId }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/api/agent/${agentId}/bookings/${bookingId}/`, { action: 'decline' });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const handleAgentlogout = createAsyncThunk("admin/logout",async () => {
  try {
    const response = await instance.post(AGENT_LOGOUT)
    localStorage.removeItem("agentTokens");
    return response.data;
    
  } catch (error) {
    throw new Error(error)
  }
})

export const handleChangePassword = createAsyncThunk("agent/password", async ({ id, oldPassword, newPassword, confirmPassword }) => {
  try {
    const url = AGENT_CHANGE_PASSWORD.replace(":id", id);
    const response = await instance.put(url, { old_password: oldPassword, new_password1: newPassword, new_password2: confirmPassword });
  
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const handlePopularDestinations = createAsyncThunk("agent/popular_destinations",async(id)=>{
  try{
    const url = AGENT_POPULAR_DESTINATIONS.replace(":id", id);
    const response = await instance.get(url);
    
    return response.data
  }catch (error) {
    throw new Error(error)
  }
})

export const handleRevenue = createAsyncThunk("agent/revenue", async(id)=>{
  try{
    const url = AGENT_REVENUE.replace(":id", id);
    const response = await instance.get(url)
    return response.data
  }catch (error) {
    throw new Error(error)
  }
});

export const handleCategoryDistribution = createAsyncThunk("agent/category", async(id)=>{
  try{
    const url = AGENT_CATEGORY_DISTRIBUTION.replace(":id", id);
    const response = await instance.get(url)
    return response.data
  }catch (error) {
    throw new Error(error)
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
  message: null,
  agentTokens: JSON.parse(localStorage.getItem("agentTokens")),
  error: null,
  packages: [],
  bookings: [],
  popularDestinations: [],
  revenue: [],
  notification_items:[],
};

const agentReducer = createSlice({
  name: "agent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //signup
      .addCase(handleAgentSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAgentSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(handleAgentSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //login
      .addCase(handleAgentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAgentLogin.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("agentTokens", JSON.stringify(action.payload?.token));
        state.agentTokens = action.payload?.token;
      })
      .addCase(handleAgentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //fetching particulat id agent
      .addCase(handleAgentIdDetails.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAgentIdDetails.fulfilled,(state,action)=>{
        state.loading = false;
        state.agents = action.payload
      })
      .addCase(handleAgentIdDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //logout
      .addCase(handleAgentlogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAgentlogout.fulfilled, (state) => {
        state.loading = false;
        state.agentTokens = null; 
      })
      .addCase(handleAgentlogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //FETCHING AGENT PACKAGES
      .addCase(handleGetAgentPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGetAgentPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.packages;
        state.packageCount = action.payload.package_count;
      })
      .addCase(handleGetAgentPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      //fetching bookings of the particular package add of a agent

      .addCase(handleGetBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGetBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.bookingCount = action.payload.booking_count;
      })
      .addCase(handleGetBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      

      .addCase(handleApproveBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleApproveBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        
      })
      .addCase(handleApproveBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
       
      })

      // Decline Booking
      .addCase(handleDeclineBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleDeclineBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        // Handle successful booking decline here, update state accordingly
      })
      .addCase(handleDeclineBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Handle rejected booking decline here, update state or handle error accordingly
      })

      //change password
      .addCase(handleChangePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleChangePassword.fulfilled, (state, action) => {
        state.loading = false;

        state.agent = action.payload; 
      })
      .addCase(handleChangePassword.rejected, (state, action) => {
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

      .addCase(handleRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(handleRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(handleCategoryDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleCategoryDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(handleCategoryDistribution.rejected, (state, action) => {
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

export default agentReducer.reducer;
