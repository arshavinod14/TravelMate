import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instance } from "../../api/axios";
import { ADD_ACTIVITIES, ADD_PACKAGE, DELETE_PACKAGE, EDIT_PACKAGE, PACKAGE, VIEW_ACTIVITIES } from "../../../constant";

export const handleFetchingPackages = createAsyncThunk("packages",async()=>{
    try {
        const response = await instance.get(PACKAGE)
        console.log("response from packages",response)
        return response.data
        
    } catch (error) {
        return Promise.reject(error);
        
    }
})


export const handleAddPackage = createAsyncThunk("addPackage", async (formData) => {
    try {
      const response = await instance.post(ADD_PACKAGE, formData);
      console.log("Package added:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding package:", error.response.data);
      // You can also display an error message to the user here
      throw error;
    }
  });

export const handleEditPackage = createAsyncThunk("editPackage", async ({id, formData} ) => {
    console.log('Received id:', id);
    console.log('Received formData:', formData);
    try {
        const url = `${EDIT_PACKAGE.replace(':id', id)}`; // Construct URL with id
        
        const response = await instance.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
    })
        return response.data;
    } catch (error) {
        throw error;
    }
})

export const handleDeletePackage = createAsyncThunk(
    'destinations/delete',
    async (id) => {
        console.log('Received id:', id);
      try {
        const url = `${DELETE_PACKAGE.replace(':id',id)}`// Construct URL with id
  
        const response = await instance.delete(url);
  
        if (response.status === 200) {
          // Success! You can optionally return any data from the response here
          return response // Or any data you want to access in your reducer
        } else {
          throw new Error('Failed to delete destination');
        }
      } catch (error) {
        throw error;
      }
    }
  );

  export const handleAddNewActivity = createAsyncThunk(
    "addNewActivity",
    async ({ formData, id }, { rejectWithValue }) => {
      console.log('Received id:', id);
      console.log('Received formData:', formData);
  
      try {
        const url = `${ADD_ACTIVITIES.replace(':id', id)}`;
        const response = await instance.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        // Handle error from the server
        if (!error.response) {
          throw error;
        }
  
        // Return the error response from the server
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const handleFetchingActivities = createAsyncThunk(
    "packages/activity",
    async (id) => {
      try {
        const url = VIEW_ACTIVITIES.replace(":id", id); // Replace :id with actual id
  
        const response = await instance.get(url);
        console.log("response from activity:", response);
        return response.data;
      } catch (error) {
        return Promise.reject(error);
      }
    }
  );
  




const initialState = {
    loading: false,
    message:"",
    packages: [],
    activities: [],
    error:null,
    
}


const packageReducer = createSlice({
    name:"package",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
            .addCase(handleFetchingPackages.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(handleFetchingPackages.fulfilled,(state,action)=>{
                state.loading = false;
                state.message = action.payload?.message;
                state.packages = action.payload?.data;
            })
            .addCase(handleFetchingPackages.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message
            })

            //add packages
            .addCase(handleAddPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleAddPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.package = action.payload; // Update state with successful response data
            })
            .addCase(handleAddPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add package'; // Handle error message
                console.error("Error adding package:", action.error);
            })

            //edit
            .addCase(handleEditPackage.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
              })
              .addCase(handleEditPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.editedPackage = action.payload; // Update state with edited package data
              })
              .addCase(handleEditPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Set error message
              })

              //delete
              .addCase(handleDeletePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.deletedPackage = null;
              })
              .addCase(handleDeletePackage.fulfilled, (state, action) => {
                state.loading = false;
                state.deletedPackage = action.payload;
              })
              .addCase(handleDeletePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              })

            //   .addCase(handleAddNewActivity.pending, (state) => {
            //     state.loading = true; // Set loading state to true while pending
            //     state.error = null; // Clear any previous errors
            //   })
            //   .addCase(handleAddNewActivity.fulfilled, (state, action) => {
            //     state.loading = false;
        
            //     // Update state with new data if needed
            //     const newActivity = action.payload;
            //     const packageToUpdate = state.packages.find(pkg => pkg.id === newActivity.packageId);
            //     if (packageToUpdate) {
            //       packageToUpdate.activities.push(newActivity);
            //     }
            // })
            //   .addCase(handleAddNewActivity.rejected, (state, action) => {
            //     state.loading = false; // Set loading state to false on rejection
            //     state.error = action.error.message; // Set error message
            //   })

            .addCase(handleAddNewActivity.pending, (state) => {
                state.loading = true; // Set loading state to true while pending
                state.error = null; // Clear any previous errors
              })
              .addCase(handleAddNewActivity.fulfilled, (state, action) => {
                state.loading = false;
              
                const { id, activity } = action.payload;
                const packageToUpdate = state.packages.find(pkg => pkg.id === id);
              
                if (packageToUpdate) {
                  packageToUpdate.activities.push(activity);
                }
              })
              .addCase(handleAddNewActivity.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on rejection
                state.error = action.error.message; // Set error message
              })
        


              //view activities
              .addCase(handleFetchingActivities.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(handleFetchingActivities.fulfilled, (state, action) => {
                state.activities = action.payload;
                state.loading = false;
              })
              .addCase(handleFetchingActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error; // Use action.error for consistency
              });

    }
    
})

export default packageReducer.reducer