import { axiosi } from "../../config/axios";

export const fetchAllBrands = async () => {
    const res = await axiosi.get("/brands");
    return res.data;
};

export const addBrand = async (brand) => {
    const res = await axiosi.post("/brands", brand);
    return res.data;
};

export const updateBrand = async ({ id, name }) => {
    const res = await axiosi.put(`/brands/${id}`, { name });
    return res.data;
};

export const deleteBrand = async (id) => {
    await axiosi.delete(`/brands/${id}`);
    return id;
};
