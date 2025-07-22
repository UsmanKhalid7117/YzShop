import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from './CategoriesApi';

const initialState = {
  status: 'idle',
  categories: [],
  errors: null
};

// 👉 Fetch all categories
export const fetchAllCategoriesAsync = createAsyncThunk(
  'categories/fetchAll',
  async () => {
    const res = await fetchAllCategories();
    return res;
  }
);

// 👉 Add new category
export const addCategoryAsync = createAsyncThunk(
  'categories/add',
  async (category) => {
    const res = await addCategory(category);
    return res;
  }
);

// 👉 Update category
export const updateCategoryAsync = createAsyncThunk(
  'categories/update',
  async ({ id, name }) => {
    const res = await updateCategory(id, { name });
    return res;
  }
);

// 👉 Delete category
export const deleteCategoryAsync = createAsyncThunk(
  'categories/delete',
  async (id) => {
    await deleteCategory(id);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categorySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchAllCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchAllCategoriesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.errors = action.error;
      })

      // ADD
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      });
  }
});

// Selectors
export const selectCategories = (state) => state.CategoriesSlice.categories;
export const selectCategoryStatus = (state) => state.CategoriesSlice.status;
export const selectCategoryErrors = (state) => state.CategoriesSlice.errors;

export default categorySlice.reducer;
