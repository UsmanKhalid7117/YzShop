import { axiosi } from '../../config/axios';

export const fetchAllCategories = async () => {
  const res = await axiosi.get('/categories');
  return res.data;
};

export const addCategory = async (category) => {
  const res = await axiosi.post('/categories', category);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axiosi.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  await axiosi.delete(`/categories/${id}`);
};
