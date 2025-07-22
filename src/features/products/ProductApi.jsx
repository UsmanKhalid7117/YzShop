import { axiosi } from "../../config/axios";

export const addProduct=async(data)=>{
    try {
        const res=await axiosi.post('/products',data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const fetchProducts = async (filters = {}) => {
  let queryString = '';

  if (filters.brand) {
    filters.brand.forEach((brand) => {
      queryString += `brand=${brand}&`;
    });
  }

  if (filters.category) {
    filters.category.forEach((category) => {
      queryString += `category=${category}&`;
    });
  }

  if (filters.pagination) {
    queryString += `page=${filters.pagination.page}&limit=${filters.pagination.limit}&`;
  }

  if (filters.sort) {
    queryString += `sort=${filters.sort.sort}&order=${filters.sort.order}&`;
  }

  if (filters.user) {
    queryString += `user=${filters.user}&`;
  }

  if (!filters.includeDeleted) {
    queryString += `isDeleted=false&`;
  }

  console.log('[ProductApi] Query:', queryString);

  try {
    const res = await axiosi.get(`/products?${queryString}`);

    return {
      data: res.data.data, // ✅ product array
      pagination: res.data.pagination, // ✅ pagination info
    };
  } catch (error) {
    console.error('[ProductApi] Fetch error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const fetchProductById=async(id)=>{
    try {
        const res=await axiosi.get(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const updateProductById=async(update)=>{
    try {
        const res=await axiosi.patch(`/products/${update._id}`,update)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const undeleteProductById=async(id)=>{
    try {
        const res=await axiosi.patch(`/products/undelete/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const deleteProductById=async(id)=>{
    try {
        const res=await axiosi.delete(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const fetchByCategoryApi = async (categoryName) => {
  console.log("Fetching products by category:", categoryName); 
  // const response = await axiosi.get(`/products/category/${categoryName}`);
  const response = await axiosi.get(`/products/category/${categoryName}`);

  return response.data; // adjust based on your backend response structure
};

export const fetchByBrandApi = async (brandName) => {
  console.log("Fetching products by brand:",brandName ); 
  const response = await axiosi.get(`/products/brand/${brandName}`);
  return response.data;
};