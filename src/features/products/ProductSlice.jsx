import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProductById,
  fetchProductById,
  fetchProducts,
  undeleteProductById,
  updateProductById,
  fetchByCategoryApi,
  fetchByBrandApi
} from "./ProductApi";

const initialState = {
  status: "idle",
  productUpdateStatus: "idle",
  productAddStatus: "idle",
  productFetchStatus: "idle",
  products: [],
  productsByCategory: [],
  productsByBrand: [],
  totalResults: 0,
  isFilterOpen: false,
  selectedProduct: null,
  errors: null,
  successMessage: null,
};

// Thunks
export const addProductAsync = createAsyncThunk("products/addProductAsync", async (data) => {
  const addedProduct = await addProduct(data);
  return addedProduct;
});

export const fetchProductsAsync = createAsyncThunk("products/fetchProductsAsync", async (filters) => {
  const products = await fetchProducts(filters);
  return products;
});

export const fetchProductByIdAsync = createAsyncThunk("products/fetchProductByIdAsync", async (id) => {
  const selectedProduct = await fetchProductById(id);
  return selectedProduct;
});

export const updateProductByIdAsync = createAsyncThunk("products/updateProductByIdAsync",async (update, { rejectWithValue }) => {
  try {
    const updatedProduct = await updateProductById(update);
    return updatedProduct;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const undeleteProductByIdAsync = createAsyncThunk("products/undeleteProductByIdAsync", async (id) => {
  const unDeletedProduct = await undeleteProductById(id);
  return unDeletedProduct;
});

export const deleteProductByIdAsync = createAsyncThunk("products/deleteProductByIdAsync", async (id) => {
  const deletedProduct = await deleteProductById(id);
  return deletedProduct;
});

export const fetchProductsByCategory = createAsyncThunk("products/fetchByCategory", async (categoryName) => {
  const data = await fetchByCategoryApi(categoryName);
  return data;
});

export const fetchProductsByBrand = createAsyncThunk("products/fetchByBrand",async (brandName) => {
  const data = await fetchByBrandApi(brandName);
  return data;
});


const productSlice = createSlice({
  name: "ProductSlice",
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.errors = null;
    },
    clearProductSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetProductStatus: (state) => {
      state.status = "idle";
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProductUpdateStatus: (state) => {
      state.productUpdateStatus = "idle";
    },
    resetProductAddStatus: (state) => {
      state.productAddStatus = "idle";
    },
    toggleFilters: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },
    resetProductFetchStatus: (state) => {
      state.productFetchStatus = "idle";
    },
    clearProductsByCategory: (state) => {
      state.productsByCategory = [];
      state.status = "idle";
    },
    clearProductsByBrand: (state) => {
      state.productsByBrand = [];
      state.brandStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProductAsync.pending, (state) => {
        state.productAddStatus = "pending";
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.productAddStatus = "fulfilled";
        state.products.push(action.payload);
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.productAddStatus = "rejected";
        state.errors = action.error;
      })

      // Fetch All Products
      .addCase(fetchProductsAsync.pending, (state) => {
        state.productFetchStatus = "pending";
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.productFetchStatus = "fulfilled";
        state.products = action.payload.data;
        state.totalResults = action.payload.totalResults;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.productFetchStatus = "rejected";
        state.errors = action.error;
      })

      // Fetch Product By ID
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.productFetchStatus = "pending";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.productFetchStatus = "fulfilled";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.productFetchStatus = "rejected";
        state.errors = action.error;
      })

      // Update Product
      .addCase(updateProductByIdAsync.pending, (state) => {
        state.productUpdateStatus = "pending";
      })
      .addCase(updateProductByIdAsync.fulfilled, (state, action) => {
        state.productUpdateStatus = "fulfilled";
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProductByIdAsync.rejected, (state, action) => {
        state.productUpdateStatus = "rejected";
        state.errors = action.error;
      })

      // Undelete Product
      .addCase(undeleteProductByIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(undeleteProductByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(undeleteProductByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      // Delete Product
      .addCase(deleteProductByIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteProductByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProductByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productsByCategory = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.status = "failed";
      })

      // Fetch Products by Brand
      .addCase(fetchProductsByBrand.pending, (state) => {
      state.brandStatus = 'loading';
    })
    .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
      state.brandStatus = 'succeeded';
      state.productsByBrand = action.payload;
    })
    .addCase(fetchProductsByBrand.rejected, (state) => {
      state.brandStatus = 'failed';
    });
  },
});

// Selectors
export const selectProductStatus = (state) => state.ProductSlice.status;
export const selectProducts = (state) => state.ProductSlice.products;
export const selectProductTotalResults = (state) => state.ProductSlice.totalResults;
export const selectSelectedProduct = (state) => state.ProductSlice.selectedProduct;
export const selectProductErrors = (state) => state.ProductSlice.errors;
export const selectProductSuccessMessage = (state) => state.ProductSlice.successMessage;
export const selectProductUpdateStatus = (state) => state.ProductSlice.productUpdateStatus;
export const selectProductAddStatus = (state) => state.ProductSlice.productAddStatus;
export const selectProductIsFilterOpen = (state) => state.ProductSlice.isFilterOpen;
export const selectProductFetchStatus = (state) => state.ProductSlice.productFetchStatus;

// Actions
export const {
  clearProductErrors,
  clearProductSuccessMessage,
  resetProductStatus,
  clearSelectedProduct,
  resetProductUpdateStatus,
  resetProductAddStatus,
  toggleFilters,
  resetProductFetchStatus,
  clearProductsByCategory,
  clearProductsByBrand,
} = productSlice.actions;

export default productSlice.reducer;
