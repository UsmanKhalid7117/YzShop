import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters } from '../ProductSlice'
import { ProductCard } from './ProductCard'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice'
import Pagination from '@mui/material/Pagination';
import { ITEMS_PER_PAGE } from '../../../constants'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { toast } from 'react-toastify'
import { banner1, banner2, banner3, banner4, loadingAnimation } from '../../../assets'
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice'
import { motion } from 'framer-motion'
import { ProductBanner } from './ProductBanner'
import ClearIcon from '@mui/icons-material/Clear';
import Lottie from 'lottie-react'
import { Link } from 'react-router-dom'




const CategoriesOptions = ['Accessories', 'Smartphones', 'Laptops', 'SmartWatches', 'Earbuds'];


const MobileBrandsOptions = ["Redmi", "Tecno", "Itel", "Oppo", "Infinix", "Samsung",];

const LaptopBrandsOptions = ["HP", "Lenovo", "Dell"];


const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
]


const bannerImages = [banner1, banner3, banner2, banner4]

export const ProductList = () => {
    const [filters, setFilters] = useState()
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState(null)
    const theme = useTheme()



    const is1200 = useMediaQuery(theme.breakpoints.down(1200))
    const is800 = useMediaQuery(theme.breakpoints.down(800))

    const is700 = useMediaQuery(theme.breakpoints.down(700))
    const is600 = useMediaQuery(theme.breakpoints.down(600))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is488 = useMediaQuery(theme.breakpoints.down(488))


    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const products = useSelector(selectProducts)
    const totalResults = useSelector(selectProductTotalResults)
    const loggedInUser = useSelector(selectLoggedInUser)

    const productFetchStatus = useSelector(selectProductFetchStatus)

    const wishlistItems = useSelector(selectWishlistItems)
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)

    const cartItemAddStatus = useSelector(selectCartItemAddStatus)

    const isProductFilterOpen = useSelector(selectProductIsFilterOpen)


    const dispatch = useDispatch()


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        setPage(1)
    }, [totalResults])


    useEffect(() => {
        const finalFilters = { ...filters };

        finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE };
        finalFilters['sort'] = sort;

        // Always hide deleted products from users
        if (!loggedInUser?.isAdmin) {
            finalFilters['user'] = true;
            finalFilters['includeDeleted'] = false;
        } else {
            // Let admin choose to view deleted or not (UI button toggle etc.)
            finalFilters['includeDeleted'] = true;
        }

        dispatch(fetchProductsAsync(finalFilters));
    }, [filters, page, sort, dispatch, loggedInUser?.isAdmin]);







    const handleAddRemoveFromWishlist = (e, productId) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: productId }
            dispatch(createWishlistItemAsync(data))
        }

        else if (!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === productId)
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    }

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist")
        }
        else if (wishlistItemAddStatus === 'rejected') {
            toast.error("Error adding product to wishlist, please try again later")
        }

    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist")
        }
        else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error("Error removing product from wishlist, please try again later")
        }
    }, [wishlistItemDeleteStatus])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart")
        }
        else if (cartItemAddStatus === 'rejected') {
            toast.error("Error adding product to cart, please try again later")
        }

    }, [cartItemAddStatus])

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Error fetching products, please try again later")
        }
    }, [productFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus())
            dispatch(resetWishlistItemAddStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [dispatch])


    const handleFilterClose = () => {
        dispatch(toggleFilters())
    }

    return (
        <>
            {/* filters side bar */}

            {
                productFetchStatus === 'pending' ?
                    <Stack width={is500 ? "35vh" : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} marginRight={'auto'} marginLeft={'auto'}>
                        <Lottie animationData={loadingAnimation} />
                    </Stack>
                    :
                    <>
                        <motion.div style={{ position: "fixed", backgroundColor: "white", height: "100vh", padding: '1rem', overflowY: "scroll", width: is500 ? "100vw" : "30rem", zIndex: 500 }} variants={{ show: { left: 0 }, hide: { left: -500 } }} initial={'hide'} transition={{ ease: "easeInOut", duration: .7, type: "spring" }} animate={isProductFilterOpen === true ? "show" : "hide"}>

                            {/* fitlers section */}
                            <Stack mb={'5rem'} sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}>


                                <Typography variant='h4'>Category</Typography>

                                <Stack mt={4} spacing={1} direction="column">
                                    {CategoriesOptions.map((cat) => (
                                        <Link
                                            key={cat}
                                            to={`/category/${cat}`}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                transition: 'background 0.3s',
                                                fontWeight: '500',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </Stack>



                                <IconButton onClick={handleFilterClose} style={{ position: "absolute", top: 15, right: 15 }}>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <ClearIcon fontSize='medium' />
                                    </motion.div>
                                </IconButton>


                                

                            </Stack>

                        </motion.div>

                        <Stack mb={'3rem'}>


                            {/* banners section */}
                            {
                                !is600 &&

                                <Stack sx={{ width: "100%", height: is800 ? "300px" : is1200 ? "400px" : "500px" }}>
                                    <ProductBanner images={bannerImages} />
                                </Stack>
                            }

                               <Stack mx={4} my={4}>
                                <Typography
                                    textAlign="center"
                                    variant="h4"
                                    mb={2}
                                    fontWeight="bold"
                                    color="black"
                                >
                                    Laptops Brands
                                </Typography>

                                <Grid container spacing={2}>
                                    {LaptopBrandsOptions.map((brand, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Link to={`/brands/${brand}`} style={{ textDecoration: 'none' }}>
                                                <Stack
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        border: "1px solid #ddd",
                                                        borderRadius: 2,
                                                        p: 1,
                                                        minHeight: 100,
                                                        textAlign: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "scale(1.03)",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            borderColor: "#999"
                                                        }
                                                    }}
                                                >
                                                    <Typography fontSize={is488 ? 16 : 18} fontWeight="500" color="text.primary">
                                                        {brand}
                                                    </Typography>
                                                </Stack>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>

                            {/* products */}
                            <Stack rowGap={5} mt={is600 ? 2 : 0}>

                                {/* sort options */}
                                <Stack flexDirection={'row'} mr={'2rem'} justifyContent={'flex-end'} alignItems={'center'} columnGap={5}>

                                    


                                    <Stack alignSelf={'flex-end'} width={'12rem'}>
                                        <FormControl fullWidth>
                                            <InputLabel id="sort-dropdown">Sort</InputLabel>
                                            <Select
                                                variant='standard'
                                                labelId="sort-dropdown"
                                                label="Sort"
                                                onChange={(e) => setSort(e.target.value)}
                                                value={sort}
                                            >
                                                <MenuItem bgcolor='text.secondary' value={null}>Reset</MenuItem>
                                                {
                                                    sortOptions.map((option) => (
                                                        <MenuItem key={option} value={option}>{option.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Stack>

                                </Stack>

                                {/* product grid */}
                                <Grid gap={is700 ? 1 : 2} container justifyContent={'center'} alignContent={'center'}>
                                    {
                                        products.map((product) => (
                                            <ProductCard key={product._id} id={product._id} title={product.title} thumbnail={product.thumbnail} brand={product.brand.name} price={product.price}  discountPercentage={product.discountPercentage}  handleAddRemoveFromWishlist={handleAddRemoveFromWishlist} />
                                        ))
                                    }
                                </Grid>

                                {/* pagination */}
                                <Stack alignSelf={is488 ? 'center' : 'flex-end'} mr={is488 ? 0 : 5} rowGap={2} p={is488 ? 1 : 0}>
                                    <Pagination size={is488 ? 'medium' : 'large'} page={page} onChange={(e, page) => setPage(page)} count={Math.ceil(totalResults / ITEMS_PER_PAGE)} variant="outlined" shape="rounded" />
                                    <Typography textAlign={'center'}>Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results</Typography>
                                </Stack>


                            </Stack>

                            <Stack mx={4} my={4}>
                                {/* */}
                                <Typography
                                    textAlign="center"
                                    variant="h4"
                                    mb={2}
                                    fontWeight="bold"
                                    color="black"
                                >
                                    Shop By Brands
                                </Typography>

                                <Grid container spacing={2}>
                                    {MobileBrandsOptions.map((brand, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Link to={`/brands/${brand}`} style={{ textDecoration: 'none' }}>
                                                <Stack
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        border: "1px solid #ddd",
                                                        borderRadius: 2,
                                                        p: 1,
                                                        minHeight: 100,
                                                        textAlign: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "scale(1.03)",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            borderColor: "#999"
                                                        }
                                                    }}
                                                >
                                                    <Typography fontSize={is488 ? 16 : 18} fontWeight="500" color="text.primary">
                                                        {brand}
                                                    </Typography>
                                                </Stack>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>

                            


                        </Stack>


                    </>
            }

        </>
    )
}
