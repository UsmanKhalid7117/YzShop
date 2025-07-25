import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectSelectedProduct
} from '../ProductSlice'
import {
  Box,
  Checkbox,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  Button,
  Paper,
  Divider
} from '@mui/material'
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems
} from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews
} from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { toast } from 'react-toastify'
import { MotionConfig, motion } from 'framer-motion'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy' // ✅ Copy icon
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems
} from '../../wishlist/WishlistSlice'
import { useTheme } from '@mui/material'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import MobileStepper from '@mui/material/MobileStepper'
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

export const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const product = useSelector(selectSelectedProduct)
  const loggedInUser = useSelector(selectLoggedInUser)
  const cartItems = useSelector(selectCartItems)
  const cartItemAddStatus = useSelector(selectCartItemAddStatus)
  const wishlistItems = useSelector(selectWishlistItems)
  const reviews = useSelector(selectReviews)
  const productFetchStatus = useSelector(selectProductFetchStatus)
  const reviewFetchStatus = useSelector(selectReviewFetchStatus)
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)

  const theme = useTheme()
  const is480 = useMediaQuery(theme.breakpoints.down(480))
  const is840 = useMediaQuery(theme.breakpoints.down(840))

  const [quantity, setQuantity] = useState(1)
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = product?.images?.length || 0

  const isProductAlreadyInCart = cartItems?.some(item => item?.product?._id === id)
  const isProductAlreadyInWishlist = wishlistItems?.some(item => item?.product?._id === id)

  const totalReviewRating = reviews?.reduce((acc, review) => acc + review.rating, 0)
  const totalReviews = reviews?.length || 0
  const averageRating = totalReviews ? Math.ceil(totalReviewRating / totalReviews) : 0

  const discount = product?.discountPercentage || 0
  const discountedPrice = product?.price - (product?.price * discount) / 100

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (id) {
      dispatch(fetchProductByIdAsync(id))
      dispatch(fetchReviewsByProductIdAsync(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (cartItemAddStatus === 'fulfilled') toast.success('Product added to cart')
    else if (cartItemAddStatus === 'rejected') toast.error('Error adding product to cart')
  }, [cartItemAddStatus])

  useEffect(() => {
    if (wishlistItemAddStatus === 'fulfilled') toast.success('Product added to wishlist')
    else if (wishlistItemAddStatus === 'rejected') toast.error('Error adding to wishlist')
  }, [wishlistItemAddStatus])

  useEffect(() => {
    if (wishlistItemDeleteStatus === 'fulfilled') toast.success('Product removed from wishlist')
    else if (wishlistItemDeleteStatus === 'rejected') toast.error('Error removing from wishlist')
  }, [wishlistItemDeleteStatus])

  useEffect(() => {
    if (productFetchStatus === 'rejected') toast.error('Error fetching product details')
    if (reviewFetchStatus === 'rejected') toast.error('Error fetching reviews')
  }, [productFetchStatus, reviewFetchStatus])

  useEffect(() => {
    return () => {
      dispatch(resetProductFetchStatus())
      dispatch(resetReviewFetchStatus())
      dispatch(resetWishlistItemAddStatus())
      dispatch(resetWishlistItemDeleteStatus())
      dispatch(resetCartItemAddStatus())
    }
  }, [dispatch])

  // const handleAddToCart = () => {
  //   if (!loggedInUser?._id) return
  //   const item = { user: loggedInUser._id, product: id, quantity }
  //   dispatch(addToCartAsync(item))
  //   setQuantity(1)
  // }
  const handleAddToCart = () => {
    if (!loggedInUser?._id) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    const item = { user: loggedInUser._id, product: id, quantity };
    dispatch(addToCartAsync(item));
    setQuantity(1);
  };


  // const handleWishlistToggle = (e) => {
  //   if (!loggedInUser?._id) return
  //   if (e.target.checked) {
  //     dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: id }))
  //   } else {
  //     const wishlistItem = wishlistItems?.find(item => item?.product?._id === id)
  //     if (wishlistItem?._id) {
  //       dispatch(deleteWishlistItemByIdAsync(wishlistItem._id))
  //     }
  //   }
  // }
  const handleWishlistToggle = (e) => {
  if (!loggedInUser?._id) {
    toast.error("Please login to add items to wishlist");
    navigate("/login");
    return;
  }

  if (e.target.checked) {
    dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: id }));
  } else {
    const wishlistItem = wishlistItems?.find(item => item?.product?._id === id);
    if (wishlistItem?._id) {
      dispatch(deleteWishlistItemByIdAsync(wishlistItem._id));
    }
  }
};


  const handleNext = () => setActiveStep(prev => prev + 1)
  const handleBack = () => setActiveStep(prev => prev - 1)
  const handleStepChange = (step) => setActiveStep(step)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Product link copied!'))
      .catch(() => toast.error('Failed to copy link'))
  }

  const btnStyle = {
    padding: '10px 15px',
    fontSize: '1rem',
    borderRadius: '8px',
    fontWeight: 500
  }

  if ((productFetchStatus === 'pending' || reviewFetchStatus === 'pending') || !product?._id) {
    return (
      <Stack minHeight="60vh" justifyContent="center" alignItems="center">
        <Lottie animationData={loadingAnimation} />
      </Stack>
    )
  }

  return (
    <Stack alignItems="center" mb={4}>
      <Stack maxWidth="1400px" width="100%" px={is480 ? 2 : 5}>
        <Stack direction={is840 ? 'column' : 'row'} spacing={4} mt={5} justifyContent="center" alignItems="center">
          {/* Images */}
          <Box width={is480 ? '100%' : 500}>
            <AutoPlaySwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
              {product?.images?.map((img, i) => (
                <Box key={i} component="img" src={img} alt={`product-${i}`} sx={{ width: '100%', objectFit: 'contain', aspectRatio: '1/1' }} />
              ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={<Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>Next</Button>}
              backButton={<Button size="small" onClick={handleBack} disabled={activeStep === 0}>Back</Button>}
            />
          </Box>

          {/* Details */}
          <Stack spacing={2} maxWidth={500}>
            <Typography variant='h4' fontWeight={600}>{product?.title}</Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Rating value={averageRating} readOnly />
              <Typography variant='body2'>({totalReviews || 'No'} Reviews)</Typography>
            </Stack>

            {/* Price with discount */}
            <Stack direction="row" spacing={2} alignItems="center">
              {discount > 0 ? (
                <>
                  <Typography variant="h5" color="error">Rs. {discountedPrice.toFixed(0)}</Typography>
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                    Rs. {product?.price}
                  </Typography>
                  <Typography variant="body2" color="green">-{discount}%</Typography>
                </>
              ) : (
                <Typography variant='h5'>Rs. {product?.price}</Typography>
              )}
            </Stack>

            <Typography>{product?.description}</Typography>

            {!loggedInUser?.isAdmin && (
              <Stack spacing={2}>
                <Stack direction='row' spacing={2} alignItems='center' flexWrap="wrap">
                  <MotionConfig whileHover={{ scale: 1.05 }}>
                    <motion.button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ ...btnStyle, border: '1px solid black', background: 'transparent' }}>-</motion.button>
                    <Typography>{quantity}</Typography>
                    <motion.button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} style={{ ...btnStyle, backgroundColor: 'black', color: 'white' }}>+</motion.button>
                  </MotionConfig>

                  {isProductAlreadyInCart ? (
                    <Button variant='contained' onClick={() => navigate('/cart')}>In Cart</Button>
                  ) : (
                    <motion.button whileHover={{ scale: 1.05 }} onClick={handleAddToCart} style={{ ...btnStyle, backgroundColor: 'black', color: 'white' }}>Add to Cart</motion.button>
                  )}

                  <Stack border="1px solid gray" borderRadius={2}>
                    <Checkbox
                      checked={isProductAlreadyInWishlist}
                      onChange={handleWishlistToggle}
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite sx={{ color: 'red' }} />}
                    />

                  </Stack>

                  {/* ✅ Copy Link Button */}


                </Stack>
                <Stack mt={3}>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyUrl}
                    sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                  >
                    Copy Product Link to Share
                  </Button>
                </Stack>
              </Stack>
            )}

            <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <LocalShippingOutlinedIcon />
                <Typography variant='body2'>Free delivery in Kahuta for orders over Rs. 150</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction='row' spacing={2} alignItems='center'>
                <CachedOutlinedIcon />
                <Typography variant='body2'>Delivery base change for non-functional returns</Typography>
              </Stack>
            </Paper>
          </Stack>
        </Stack>

        <Divider sx={{ my: 5 }} />
        <Reviews productId={id} averageRating={averageRating} />
      </Stack>
    </Stack>
  )
}
