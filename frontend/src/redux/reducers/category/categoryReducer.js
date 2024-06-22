import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instance } from "../../api/axios";
import { ADD_CATEGORY, DELETE_CATEGORY, EDIT_CATEGORY } from "../../../constant";

export const handleAddCategory = createAsyncThunk("admins/add-category",async (formData)=>{
    try{
        const response = await instance.post(ADD_CATEGORY,formData)

        return response.data
    }catch(error){
        return Promise.reject(error)
    }
})


export const handleEditCategory = createAsyncThunk("admins/edit-category",async ({formData,id})=>{
    console.log('Received id:', id);
        console.log('Received formData:', formData);
        try {
            const url = `${EDIT_CATEGORY.replace(':id', id)}`; // Construct URL with id
            
            const response = await instance.put(url, formData)
            return response.data;
        } catch (error) {
            throw error;
        }

})


export const handleDeleteCategory = createAsyncThunk(
    'categorys/delete',
    async (id) => {
        console.log('Received id:', id);
      try {
        const url = `${DELETE_CATEGORY.replace(':id',id)}`// Construct URL with id
  
        const response = await instance.delete(url);
  
        if (response.status === 200) {
          // Success! You can optionally return any data from the response here
          return response // Or any data you want to access in your reducer
        } else {
          throw new Error('Failed to delete category');
        }
      } catch (error) {
        throw error;
      }
    }
  );


const initialState = {
    loading: false,
    message:"",
    category:[],
    error: null

}

const CategoryReducer = createSlice({
    name: "category",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(handleAddCategory.pending,(state)=>{
                state.loading  = true;
                state.error=null
            })
            .addCase(handleAddCategory.fulfilled,(state,action)=>{
                state.loading = false
                state.category =  [...state.category,action.payload]
            })
            .addCase(handleAddCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; 
            })

            //edit
            .addCase(handleEditCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleEditCategory.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the payload is the updated category data
                // Update your categories array here
                const updatedCategory = action.payload;
                const index = state.category.findIndex(cat => cat.id === updatedCategory.id);
                if (index !== -1) {
                    state.category[index] = updatedCategory;
  }
            })
            .addCase(handleEditCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            //delete
            .addCase(handleDeleteCategory.pending, (state, action) => {
                state.loading = true; // Set loading to true (optional)
            })
            .addCase(handleDeleteCategory.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false
                const deletedCategoryId = action.payload.data.id; // Access data from response (assuming data property)
                state.category = state.category.filter(
                    (cat) => cat.id !== deletedCategoryId
                ); // Update state to remove deleted category
            })
            .addCase(handleDeleteCategory.rejected, (state, action) => {
                state.loading = false; // Set loading to false
                state.error = action.error.message; // Set error message
            });


            
    }
})


export default CategoryReducer.reducer