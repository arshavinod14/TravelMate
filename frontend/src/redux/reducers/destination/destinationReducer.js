import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../api/axios";
import { ADD_DESTINATION, DELETE_DESTINATION, DESTINATION, EDIT_DESTINATION } from "../../../constant";

export const handleFetchingDestination = createAsyncThunk("destinations",async ()=>{
    try {
        const response = await instance.get(DESTINATION)
        console.log("destination response",response)
        return response.data
        
    } catch (error) {
        return Promise.reject(error);
    }
})


export const handleAddDestination = createAsyncThunk("destinations/add", async (formData) => {
    try {
        const response = await instance.post(ADD_DESTINATION, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("add destination response", response);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
});

export const handleEditDestination = createAsyncThunk(
    'destinations/edit',
    async ({id, formData} ) => {
        console.log('Received id:', id);
        console.log('Received formData:', formData);
        try {
            const url = `${EDIT_DESTINATION.replace(':id', id)}`; 
            
            const response = await instance.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        })
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);


export const handleDeleteDestination = createAsyncThunk(
    'destinations/delete',
    async (id) => {
        console.log('Received id:', id);
      try {
        const url = `${DELETE_DESTINATION.replace(':id',id)}`
  
        const response = await instance.delete(url);
  
        if (response.status === 200) {
        
          return response 
        } else {
          throw new Error('Failed to delete destination');
        }
      } catch (error) {
        throw error;
      }
    }
  );

  

const initialState = {
    loading: false,
    message: "",
    destinations: [],
    error:null
}

const destinationReducer = createSlice({
    name: 'destination',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
            .addCase(handleFetchingDestination.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })  
            .addCase(handleFetchingDestination.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload?.message
                state.destinations = action.payload?.data
            })
            .addCase(handleFetchingDestination.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.error.message
            })

            .addCase(handleAddDestination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleAddDestination.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = [...state.destinations, action.payload]; // Add new destination to state
            })
            
            .addCase(handleAddDestination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; 
            })
            .addCase(handleEditDestination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleEditDestination.fulfilled, (state, action) => {
                const destinationIndex = state.destinations.findIndex(destination => destination.id === action.payload.id);
                if (destinationIndex >= 0) {
                  state.destinations[destinationIndex] = action.payload;
                } else {
                  state.destinations.push(action.payload);
                }
              })
              .addCase(handleEditDestination.rejected, (state, action) => {
                state.error = action.error.message;
              })

              
              .addCase(handleDeleteDestination.pending, (state, action) => {
                state.loading = true; 
              })
              .addCase(handleDeleteDestination.fulfilled, (state, action) => {
                state.loading = false; 
                const deletedDestinationId = action.payload.data.id; // Access data from response 
                state.destinations = state.destinations.filter(
                  (destination) => destination.id !== deletedDestinationId
                ); 
              })
              .addCase(handleDeleteDestination.rejected, (state, action) => {
                state.loading = false; 
                state.error = action.error.message; 
              });
    }
})


export default destinationReducer.reducer
