import {
  FormHelperText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import {
  addToCartAsync,
  selectCartItems
} from '../../cart/CartSlice';
import { motion } from 'framer-motion';

export const ProductCard = ({
  id,
  title,
  price,
  discountPercentage,
  thumbnail,
  brand,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard,
  isAdminCard
}) => {
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const theme = useTheme();
  const is1410 = useMediaQuery(theme.breakpoints.down(1410));
  const is932 = useMediaQuery(theme.breakpoints.down(932));
  const is752 = useMediaQuery(theme.breakpoints.down(752));
  const is608 = useMediaQuery(theme.breakpoints.down(608));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));
  const is408 = useMediaQuery(theme.breakpoints.down(408));

  const isProductAlreadyInWishlist = wishlistItems?.some(
    (item) => item?.product?._id === id
  );

  const isProductAlreadyInCart = cartItems?.some(
    (item) => item?.product?._id === id
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!loggedInUser?._id) return;
    const data = { user: loggedInUser._id, product: id };
    dispatch(addToCartAsync(data));
  };

  // Avoid rendering if no ID (invalid product)
  if (!id) return null;

  // Calculate discounted price if applicable
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? price - (price * discountPercentage) / 100
    : price;

    console.log({  discountPercentage });


  return (
    <Stack
      component={
        isAdminCard || isWishlistCard || is408 ? 'div' : Paper
      }
      mt={is408 ? 2 : 0}
      elevation={1}
      p={2}
      width={
        is408
          ? 'auto'
          : is488
          ? '200px'
          : is608
          ? '240px'
          : is752
          ? '300px'
          : is932
          ? '240px'
          : is1410
          ? '300px'
          : '340px'
      }
      sx={{ cursor: 'pointer' }}
      onClick={() => navigate(`/product-details/${id}`)}
    >
      {/* Image Section */}
      <Stack>
        <img
          width={'100%'}
          style={{ aspectRatio: 1 / 1, objectFit: 'contain' }}
          height={'100%'}
          src={thumbnail}
          alt={`${title} photo unavailable`}
        />
      </Stack>

      {/* Product Info Section */}
      <Stack flex={2} justifyContent={'flex-end'} spacing={1} rowGap={2}>
        <Stack>
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography variant='h6' fontWeight={400}>
              {title}
            </Typography>

            {!isAdminCard && (
              <motion.div
                whileHover={{ scale: 1.3, y: -10, zIndex: 100 }}
                whileTap={{ scale: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
              >
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={isProductAlreadyInWishlist}
                  onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite sx={{ color: 'red' }} />}
                />
              </motion.div>
            )}
          </Stack>

          <Typography color={'text.secondary'}>
            {brand || 'Unknown Brand'}
          </Typography>
        </Stack>

        {/* Price and Cart */}
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography>
            {hasDiscount ? (
              <>
                <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                  Rs. {price}
                </span>{' '}
                <strong style={{ color: '#2e7d32' }}>
                  Rs. {discountedPrice.toFixed(0)}
                </strong>
              </>
            ) : (
              <>Rs. {price}</>
            )}
          </Typography>

          {!isWishlistCard &&
            (isProductAlreadyInCart ? (
              <Typography variant='body2' color='primary'>
                Added to cart
              </Typography>
            ) : (
              !isAdminCard && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 1 }}
                  onClick={handleAddToCart}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '3px',
                    outline: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'black',
                    color: 'white',
                    fontSize: is408
                      ? '.9rem'
                      : is488
                      ? '.7rem'
                      : is500
                      ? '.8rem'
                      : '.9rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: '.5rem'
                    }}
                  >
                    <p>Add To Cart</p>
                  </div>
                </motion.button>
              )
            ))}
        </Stack>

        {/* Stock Alert */}
        {stockQuantity <= 20 && (
          <FormHelperText sx={{ fontSize: '.9rem' }} error>
            {stockQuantity === 1
              ? 'Only 1 stock is left'
              : 'Only few are left'}
          </FormHelperText>
        )}
      </Stack>
    </Stack>
  );
};
