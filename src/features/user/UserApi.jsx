import { axiosi } from "../../config/axios"

export const fetchLoggedInUserById = async (id) => {
  try {
    const res = await axiosi.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error?.response?.data || { message: "Something went wrong!" };
  }
};

export const updateUserById = async (update) => {
  try {
    const res = await axiosi.patch(`/users/${update._id}`, update);
    return res.data;
  } catch (error) {
    console.error("Update User Error:", error);
    throw error?.response?.data || { message: "Something went wrong!" };
  }
};
