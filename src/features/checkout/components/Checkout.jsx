import {
  Stack, TextField, Typography, Button, Grid, FormControl,
  Radio, Paper, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { Cart } from '../../cart/components/Cart';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAddressAsync,
  selectAddressStatus,
  selectAddresses
} from '../../address/AddressSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
  createOrderAsync,
  selectCurrentOrder,
  selectOrderStatus
} from '../../order/OrderSlice';
import {
  resetCartByUserIdAsync,
  selectCartItems
} from '../../cart/CartSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Delivery } from '../../../constants';
import { motion } from 'framer-motion';

export const Checkout = () => {
  const addresses = useSelector(selectAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod] = useState('COD');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const addressStatus = useSelector(selectAddressStatus);
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const orderStatus = useSelector(selectOrderStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  const subtotal = cartItems.reduce((acc, item) => {
  const price = item.product.price;
  const discount = item.product.discountPercentage || 0;
  const discountedPrice = price - (price * discount) / 100;
  return acc + discountedPrice * item.quantity;
}, 0);

  const deliveryFee = subtotal >= 150 ? 0 : Delivery;
  const total = subtotal + deliveryFee;

  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      reset();
      const latest = addresses[addresses.length - 1];
      if (latest) setSelectedAddress(latest);
    } else if (addressStatus === 'rejected') {
      alert('Error adding your address');
    }
  }, [addressStatus, addresses, reset]);


  useEffect(() => {
    const sendEmails = async () => {
      const products = cartItems.map(item => `${item.product.title} (x${item.quantity})`).join(", ");
      const address = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}, ${selectedAddress.country}`;

      const adminEmailBody = `
      <h2>New Order Received</h2>
      <p><strong>Order ID:</strong> ${currentOrder._id}</p>
      <p><strong>Products:</strong> ${products}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p>This product was ordered by <strong>${loggedInUser.email}</strong>.</p>
    `;

      const userEmailBody = `
      <h2>Order Confirmation - YZ Shop</h2>
      <p><strong>Order ID:</strong> ${currentOrder._id}</p>
      <p><strong>Products:</strong> ${products}</p>
      <p><strong>Delivery Address:</strong> ${address}</p>
      <p>Your order has been successfully placed. Thank you for shopping with us!</p>
    `;

      try {
        await fetch(`${process.env.REACT_APP_BASE_URL}/api/send-email`, {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "yzmobilelaptop@gmail.com",
            subject: `New Order: ${currentOrder._id}`,
            html: adminEmailBody
          })
        });

        await fetch(`${process.env.REACT_APP_BASE_URL}/api/send-email`, {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: loggedInUser.email,
            subject: "Your Order Confirmation - YZ Shop",
            html: userEmailBody
          })
        });

        console.log("Emails sent successfully.");
      } catch (error) {
        console.error("Email sending failed:", error);
      }
    };

    if (currentOrder?._id && loggedInUser?.email && selectedAddress) {
      dispatch(resetCartByUserIdAsync(loggedInUser._id));
      sendEmails();
      alert(`Order placed successfully!\n\nOrder ID: ${currentOrder._id}`);
      navigate(`/order-success/${currentOrder._id}`);
    }
  }, [currentOrder]);



  const handleAddAddress = (data) => {
    const address = {
      ...data,
      user: loggedInUser._id,
      country: "Pakistan",
      type: "home"
    };
    dispatch(addAddressAsync(address));
  };

  const handleCreateOrder = () => {
    if (!selectedAddress) {
      alert('Please select or add an address.');
      return;
    }

    const order = {
      user: loggedInUser._id,
      item: cartItems,
      address: selectedAddress,
      paymentMode: selectedPaymentMethod,
      total
    };
    dispatch(createOrderAsync(order));
  };

  return (
    <Stack direction="column" p={2} spacing={4} flexWrap="wrap" mb="5rem" mt={2} alignItems="center">
      {/* Left: Delivery + Address */}
      <Stack spacing={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <motion.div whileHover={{ x: -5 }}>
            <IconButton component={Link} to="/cart">
              <ArrowBackIcon fontSize={is480 ? "medium" : "large"} />
            </IconButton>
          </motion.div>
          <Typography variant="h4">Delivery Information</Typography>
        </Stack>

        {/* Address Form */}
        <Stack component="form" noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
          <Stack>
            <Typography gutterBottom>Street</Typography>
            <TextField {...register("street", { required: true })} />
            {errors.street && <Typography color="error">Street is required</Typography>}
          </Stack>

          <Stack>
            <Typography gutterBottom>Phone Number</Typography>
            <TextField type='text' {...register("phoneNumber", { required: true })} />
            {errors.phoneNumber && <Typography color="error">Phone is required</Typography>}
          </Stack>

          <Stack flexDirection={'row'} gap={2}>
            <Stack width={'100%'}>
              <Typography gutterBottom>City</Typography>
              <TextField
                defaultValue="Kahuta"
                InputProps={{ readOnly: true }}
                {...register("city", { required: true })}
                error={true}
                helperText="⚠️ For now, delivery service is only available in Kahuta"
              />
              {errors.city && (
                <Typography color="error">City is required</Typography>
              )}
            </Stack>


            <Stack width={'100%'}>
              <Typography gutterBottom>State</Typography>
              <TextField {...register("state", { required: true })} />
              {errors.state && <Typography color="error">State is required</Typography>}
            </Stack>

            <Stack width={'100%'}>
              <Typography gutterBottom>Postal Code</Typography>
              <TextField type='text' {...register("postalCode", { required: true })} />
              {errors.postalCode && <Typography color="error">Postal Code is required</Typography>}
            </Stack>
          </Stack>

          <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
            <LoadingButton loading={addressStatus === 'pending'} type='submit' variant='contained'>Add</LoadingButton>
            <Button color='error' variant='outlined' onClick={() => reset()}>Reset</Button>
          </Stack>
        </Stack>

        {/* Existing Addresses */}
        <Stack spacing={2}>
          <Typography variant="h6">Saved Addresses</Typography>
          <Grid container spacing={2}>
            {addresses.map((addr) => (
              <Grid item key={addr._id}>
                <Paper elevation={1} sx={{ p: 2, width: is480 ? '100%' : 300 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center">
                      <Radio
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                      />
                      <Typography>{addr.street}</Typography>
                    </Stack>
                    <Typography>{addr.city}, {addr.state}, {addr.country}, {addr.postalCode}</Typography>
                    <Typography>{addr.phoneNumber}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Payment Method */}
        <Stack spacing={1}>
          <Typography variant="h6">Payment Method</Typography>
          <Stack direction="row" alignItems="center">
            <Radio checked />
            <Typography>Cash on Delivery (COD)</Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Right: Summary + Order Button */}
      <Stack spacing={2} width={is900 ? '100%' : 'auto'}>
        <Typography variant="h4">Order Summary</Typography>
        <Cart checkout />
        <LoadingButton
          fullWidth
          loading={orderStatus === 'pending'}
          variant="contained"
          size="large"
          onClick={handleCreateOrder}
        >
          Order Now
        </LoadingButton>
      </Stack>
    </Stack>
  );
};
