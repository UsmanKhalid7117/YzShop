import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { Button, Chip, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Delivery } from '../../../constants'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
    const subtotal = items.reduce((acc, item) => {
    if (!item.product) return acc;

    const discount = item.product.discountPercentage || 0;
    const originalPrice = item.product.price;
    const discountedPrice = originalPrice - (originalPrice * discount / 100);

    return acc + discountedPrice * item.quantity;
}, 0);

const totalSavings = items.reduce((acc, item) => {
    if (!item.product || !item.product.discountPercentage) return acc;

    const discount = item.product.discountPercentage;
    const price = item.product.price;
    const savings = (price * discount / 100) * item.quantity;

    return acc + savings;
}, 0);

const totalItems = items.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + item.quantity;
}, 0);


    // const totalItems=items.reduce((acc,item)=>acc+item.quantity,0)
    const navigate = useNavigate()
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))

    // changes
    const deliveryFee = subtotal >= 150 ? 0 : Delivery;
    const total = subtotal + deliveryFee;

    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (items.length === 0) {
            navigate("/")
        }
    }, [items])

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success("Product removed from cart")
        }
        else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Error removing product from cart, please try again later")
        }
    }, [cartItemRemoveStatus])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [])

    return (
        <Stack justifyContent={'flex-start'} alignItems={'center'} mb={'5rem'} >

            <Stack width={is900 ? 'auto' : '50rem'} mt={'3rem'} paddingLeft={checkout ? 0 : 2} paddingRight={checkout ? 0 : 2} rowGap={4} >

                {/* cart items */}
                <Stack rowGap={2}>
                    {
                        items && items.map((item) => (
                            item.product && (
                                <CartItem
                                    key={item._id}
                                    id={item._id}
                                    title={item.product.title}
                                    brand={item.product.brand.name}
                                    category={item.product.category.name}
                                    price={item.product.price}
                                    discountPercentage={item.product.discountPercentage}
                                    quantity={item.quantity}
                                    thumbnail={item.product.thumbnail}
                                    stockQuantity={item.product.stockQuantity}
                                    productId={item.product._id}
                                />
                            )
                        ))
                    }

                </Stack>

                {/* subtotal */}
                <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    {
                        checkout ? (
                            <Stack rowGap={2} width={'100%'}>
                                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                    <Typography>Subtotal</Typography>
                                    <Typography>Rs. {subtotal}</Typography>
                                </Stack>

                                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                    <Typography>Delivery Fee</Typography>
                                    <Typography>
                                        {deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee}`}
                                    </Typography>
                                </Stack>

                                <hr />

                                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                    <Typography>Total</Typography>
                                    <Typography>Rs. {total}</Typography>
                                </Stack>
                            </Stack>
                        ) : (
                            <>
                                <Stack>
                                    <Typography variant='h6' fontWeight={500}>Total items in cart </Typography>
                                    <Typography  variant='h6' fontWeight={500}>Total Saving</Typography>
                                    
                                    <Typography variant='h6' fontWeight={500}>Subtotal</Typography>
                               
                                </Stack>

                                <Stack>
                                    <Typography variant='h6' fontWeight={500}> {totalItems}</Typography>
                                    <Typography variant='h6' fontWeight={500}>Rs. {totalSavings}</Typography>

                                    <Typography variant='h6' fontWeight={500}>Rs. {subtotal}</Typography>
                                </Stack>
                            </>
                        )
                    }
                </Stack>

                {/* checkout or continue shopping */}
                {
                    !checkout &&
                    <Stack rowGap={'1rem'}>
                        <Button variant='contained' component={Link} to='/checkout'>Checkout</Button>
                        <motion.div style={{ alignSelf: 'center' }} whileHover={{ y: 2 }}><Chip sx={{ cursor: "pointer", borderRadius: "8px" }} component={Link} to={'/'} label="or continue shopping" variant='outlined' /></motion.div>
                    </Stack>
                }

            </Stack>


        </Stack>
    )
}
