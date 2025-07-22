import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllBrands, addBrand, updateBrand, deleteBrand } from './BrandApi';

const initialState = {
    status: "idle",
    brands: [],
    errors: null
};

// Thunks
export const fetchAllBrandsAsync = createAsyncThunk('brands/fetchAll', async () => {
    return await fetchAllBrands();
});

export const addBrandAsync = createAsyncThunk('brands/add', async (brand) => {
    return await addBrand(brand);
});

export const updateBrandAsync = createAsyncThunk('brands/update', async ({ id, name }) => {
    return await updateBrand({ id, name });
});

export const deleteBrandAsync = createAsyncThunk('brands/delete', async (id) => {
    return await deleteBrand(id);
});

const brandSlice = createSlice({
    name: "brandSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAllBrandsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.brands = action.payload;
            })
            .addCase(fetchAllBrandsAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.errors = action.error;
            })

            // Add
            .addCase(addBrandAsync.fulfilled, (state, action) => {
                state.brands.push(action.payload);
            })

            // Update
            .addCase(updateBrandAsync.fulfilled, (state, action) => {
                const index = state.brands.findIndex(brand => brand._id === action.payload._id);
                if (index !== -1) {
                    state.brands[index] = action.payload;
                }
            })

            // Delete
            .addCase(deleteBrandAsync.fulfilled, (state, action) => {
                state.brands = state.brands.filter(brand => brand._id !== action.payload);
            });
    }
});

// Selectors
export const selectBrandStatus = (state) => state.BrandSlice.status;
export const selectBrands = (state) => state.BrandSlice.brands;
export const selectBrandErrors = (state) => state.BrandSlice.errors;

export default brandSlice.reducer;
