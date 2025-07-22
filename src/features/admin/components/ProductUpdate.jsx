import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import {
  fetchProductByIdAsync,
  updateProductByIdAsync,
  clearSelectedProduct,
  resetProductUpdateStatus,
  selectSelectedProduct,
  selectProductUpdateStatus,
} from '../../products/ProductSlice';
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { toast } from 'react-toastify';

export const ProductUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedProduct = useSelector(selectSelectedProduct);
  const productUpdateStatus = useSelector(selectProductUpdateStatus);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setValue('title', selectedProduct.title);
      setValue('brand', selectedProduct.brand._id);
      setValue('category', selectedProduct.category._id);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage);
      setValue('stockQuantity', selectedProduct.stockQuantity);
      setThumbnailPreview(selectedProduct.thumbnail);
      setImagePreviews(selectedProduct.images);
    }
  }, [selectedProduct, setValue]);

  useEffect(() => {
    if (productUpdateStatus === 'fullfilled') {
      toast.success('Product Updated');
        reset();
      navigate('/admin/dashboard');
    } else if (productUpdateStatus === 'rejected') {
      toast.error('Error updating product, please try again later');
    }
  }, [productUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductUpdateStatus());
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

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMAGE_UPLOAD_API}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await res.json();
    if (data && data.data && data.data.url) {
      return data.data.url;
    } else {
      console.error('Invalid ImgBB response:', data);
      throw new Error('ImgBB Upload Failed');
    }
  };

  const handleUpdateProduct = async (data) => {
    try {
      setLoading(true);

      const updatedImages = [];
      for (const file of imageFiles) {
        const url = await uploadToImgBB(file);
        updatedImages.push(url);
      }

      const finalImages = [...selectedProduct.images, ...updatedImages];
      const thumbnailURL = thumbnailFile
        ? await uploadToImgBB(thumbnailFile)
        : selectedProduct.thumbnail;

      const updatedProduct = {
        _id: selectedProduct._id,
        title: data.title,
        brand: data.brand,
        category: data.category,
        description: data.description,
        price: data.price,
        discountPercentage: data.discountPercentage || 0,
        stockQuantity: data.stockQuantity,
        thumbnail: thumbnailURL,
        images: finalImages,
      };

      toast.success('Product Updated Successfully!');
      dispatch(updateProductByIdAsync(updatedProduct));
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Something went wrong during update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack p="0 16px" justifyContent="center" alignItems="center">
      {selectedProduct && (
        <Stack
          width={is1100 ? '100%' : '60rem'}
          rowGap={4}
          mt={is480 ? 4 : 6}
          mb={6}
          component="form"
          noValidate
          onSubmit={handleSubmit(handleUpdateProduct)}
        >
          <Stack rowGap={3}>
            <Stack>
              <Typography variant="h6">Title</Typography>
              <TextField {...register('title', { required: 'Title is required' })} />
            </Stack>

            <Stack flexDirection="row" columnGap={2}>
              <FormControl fullWidth>
                <InputLabel id="brand-selection">Brand</InputLabel>
                <Select
                  {...register('brand', { required: 'Brand is required' })}
                  labelId="brand-selection"
                  label="Brand"
                  defaultValue={selectedProduct.brand._id}
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
                  {...register('category', { required: 'Category is required' })}
                  labelId="category-selection"
                  label="Category"
                  defaultValue={selectedProduct.category._id}
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
                {...register('description', {
                  required: 'Description is required',
                })}
              />
            </Stack>

            <Stack flexDirection="row" columnGap={2}>
              <Stack flex={1}>
                <Typography variant="h6">Price</Typography>
                <TextField type="number" {...register('price', { required: 'Price is required' })} />
              </Stack>
              <Stack flex={1}>
                <Typography variant="h6">Discount %</Typography>
                <TextField type="number" {...register('discountPercentage')} />
              </Stack>
            </Stack>

            <Stack>
              <Typography variant="h6">Stock Quantity</Typography>
              <TextField type="number" {...register('stockQuantity', { required: true })} />
            </Stack>

            <Stack>
              <Typography variant="h6">Thumbnail</Typography>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} />
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                />
              )}
            </Stack>

            <Stack>
              <Typography variant="h6">Product Images</Typography>
              <input type="file" multiple accept="image/*" onChange={handleImageFilesChange} />
              <Stack direction="row" flexWrap="wrap" mt={2} gap={2}>
                {imagePreviews.map((url, index) => (
                  <Stack key={index} position="relative" width={100} height={100}>
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                    <CloseIcon
                      onClick={() => {
                        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                        if (index >= selectedProduct.images.length) {
                          setImageFiles((prev) => prev.filter((_, i) => i !== index - selectedProduct.images.length));
                        }
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        fontSize: 20,
                        color: 'red',
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>

          <Stack flexDirection="row" alignSelf="flex-end" columnGap={is480 ? 1 : 2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              component={Link}
              to="/admin/dashboard"
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
