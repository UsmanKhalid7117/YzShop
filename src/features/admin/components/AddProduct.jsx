import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
} from "../../products/ProductSlice";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategoriesSlice";
import { toast } from "react-toastify";

export const AddProduct = () => {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productAddStatus = useSelector(selectProductAddStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (productAddStatus === "fullfilled") {
  toast.success("New product added");
  
  reset();
  setThumbnailFile(null);
  setThumbnailPreview(null);
  setImageFiles([]);
  setImagePreviews([]);

  // Force refresh or redirect after delay
  setTimeout(() => {
    navigate("/admin/dashboard");
  }, 500);
}
 else if (productAddStatus === "rejected") {
      toast.error("Error adding product, please try again later");
    }
  }, [productAddStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
      imageFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

const uploadToCloudinary = async (file) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      console.error("Cloudinary upload error:", data.error.message);
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};



const handleAddProduct = async (data) => {
  try {
    if (!thumbnailFile || imageFiles.length === 0) {
      toast.error("Please select thumbnail and images");
      return;
    }

    setLoading(true);

    // Upload thumbnail
    const thumbnailURL = await uploadToCloudinary(thumbnailFile);

    // Upload product images
    const uploadedImages = [];
    for (const file of imageFiles) {
      const url = await uploadToCloudinary(file);
      uploadedImages.push(url);
    }

    const newProduct = {
      title: data.title,
      brand: data.brand,
      category: data.category,
      description: data.description,
      price: data.price,
      discountPercentage: data.discountPercentage || 0,
      stockQuantity: data.stockQuantity,
      thumbnail: thumbnailURL,
      images: uploadedImages,
    };

    toast.success("Product added successfully!");
    dispatch(addProductAsync(newProduct));
  } catch (err) {
    console.error("Error uploading images:", err);
    toast.error("Something went wrong during upload.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Stack p="0 16px" justifyContent="center" alignItems="center" flexDirection="row">
      <Stack
        width={is1100 ? "100%" : "60rem"}
        rowGap={4}
        mt={is480 ? 4 : 6}
        mb={6}
        component="form"
        noValidate
        onSubmit={handleSubmit(handleAddProduct)}
      >
        {/* FORM FIELDS */}
        <Stack rowGap={3}>
          <Stack>
            <Typography variant="h6">Title</Typography>
            <TextField {...register("title", { required: "Title is required" })} />
          </Stack>

          <Stack flexDirection="row" columnGap={2}>
            <FormControl fullWidth>
              <InputLabel id="brand-selection">Brand</InputLabel>
              <Select
                {...register("brand", { required: "Brand is required" })}
                labelId="brand-selection"
                label="Brand"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="category-selection">Category</InputLabel>
              <Select
                {...register("category", { required: "Category is required" })}
                labelId="category-selection"
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack>
            <Typography variant="h6">Description</Typography>
            <TextField
              multiline
              rows={4}
              {...register("description", { required: "Description is required" })}
            />
          </Stack>

          <Stack flexDirection="row" columnGap={2}>
            <Stack flex={1}>
              <Typography variant="h6">Price</Typography>
              <TextField
                type="number"
                {...register("price", { required: "Price is required" })}
              />
            </Stack>
            <Stack flex={1}>
              <Typography variant="h6">Discount %</Typography>
              <TextField
                type="number"
                {...register("discountPercentage")}
              />
            </Stack>
          </Stack>

          <Stack>
            <Typography variant="h6">Stock Quantity</Typography>
            <TextField
              type="number"
              {...register("stockQuantity", {
                required: "Stock Quantity is required",
              })}
            />
          </Stack>

          {/* Thumbnail Upload */}
          <Stack>
            <Typography variant="h6">Thumbnail</Typography>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnailPreview && (
  <Stack position="relative" width={100} height={100} mt={1}>
    <img
      src={thumbnailPreview}
      alt="Thumbnail Preview"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 8,
      }}
    />
    <CloseIcon
      onClick={() => {
        setThumbnailFile(null);
        setThumbnailPreview(null);
      }}
      sx={{
        position: "absolute",
        top: -8,
        right: -8,
        cursor: "pointer",
        backgroundColor: "white",
        borderRadius: "50%",
        fontSize: 20,
        color: "red",
      }}
    />
  </Stack>
)}

          </Stack>

          {/* Gallery Upload */}
          <Stack>
            <Typography variant="h6">Product Images</Typography>
            <input type="file" accept="image/*" multiple onChange={handleImageFilesChange} />
            <Stack direction="row" flexWrap="wrap" mt={2} gap={2}>
              {imagePreviews.map((url, index) => (
                <Stack key={index} position="relative" width={100} height={100}>
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <CloseIcon
                    onClick={() => {
                      setImageFiles((prev) => prev.filter((_, i) => i !== index));
                      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                    }}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      cursor: "pointer",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      fontSize: 20,
                      color: "red",
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>

          {/* Submit / Cancel */}
          <Stack flexDirection="row" alignSelf="flex-end" columnGap={is480 ? 1 : 2}>
            <Button
              type="submit"
              size={is480 ? "medium" : "large"}
              variant="contained"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add Product"}
            </Button>
            <Button
              size={is480 ? "medium" : "large"}
              variant="outlined"
              color="error"
              component={Link}
              to="/admin/dashboard"n 
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
