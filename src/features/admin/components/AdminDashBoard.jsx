import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import { selectBrands } from '../../brands/BrandSlice';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { selectCategories } from '../../categories/CategoriesSlice';
import { ProductCard } from '../../products/components/ProductCard';
import { deleteProductByIdAsync, fetchProductsAsync, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters, undeleteProductByIdAsync } from '../../products/ProductSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClearIcon from '@mui/icons-material/Clear';
import { ITEMS_PER_PAGE } from '../../../constants';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
];

export const AdminDashBoard = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showDeleted, setShowDeleted] = useState(false);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [page, setPage] = useState(1);
    const products = useSelector(selectProducts);
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();
    const [productMenuOpen, setProductMenuOpen] = useState(false);

    const is500 = useMediaQuery(theme.breakpoints.down(500));
    const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
    const totalResults = useSelector(selectProductTotalResults);
    const is600 = useMediaQuery(theme.breakpoints.down(600));
    const is488 = useMediaQuery(theme.breakpoints.down(488));

    useEffect(() => {
        const finalFilters = {
            ...filters,
            pagination: { page: page, limit: ITEMS_PER_PAGE },
            isDeleted: showDeleted ? true : false,
        };

        if (sort) {
            finalFilters.sort = sort;
        }
        dispatch(fetchProductsAsync(finalFilters));
    }, [filters, sort, page, showDeleted]);

    const confirmDeleteProduct = () => {
        if (productToDelete) {
            dispatch(deleteProductByIdAsync(productToDelete));
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleProductDelete = (productId) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const handleProductUnDelete = (productId) => {
        dispatch(undeleteProductByIdAsync(productId)).then(() => {
            // refetch to ensure admin list is up-to-date
            dispatch(fetchProductsAsync({ includeDeleted: true }));
        });
    };

    const handleFilterClose = () => {
        dispatch(toggleFilters());
    };

    return (
        <>
            <motion.div style={{ position: "fixed", backgroundColor: "white", height: "100vh", padding: '1rem', overflowY: "scroll", width: is500 ? "100vw" : "30rem", zIndex: 500 }} variants={{ show: { left: 0 }, hide: { left: -500 } }} initial={'hide'} transition={{ ease: "easeInOut", duration: .7, type: "spring" }} animate={isProductFilterOpen ? "show" : "hide"}>
                <Typography variant="h4">Dashboard</Typography>
                <IconButton onClick={handleFilterClose} style={{ position: 'absolute', top: 15, right: 15 }}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <ClearIcon fontSize="medium" />
                    </motion.div>
                </IconButton>
                <Stack rowGap={2} ml={2} mt={4}>
                    <Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ cursor: "pointer" }} onClick={() => setProductMenuOpen(!productMenuOpen)}>
                            <Typography variant="body2">Products</Typography>
                            <motion.div animate={{ rotate: productMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <KeyboardArrowDownIcon fontSize="small" />
                            </motion.div>
                        </Stack>
                        {productMenuOpen && (
                            <Stack pl={2} pt={1} rowGap={1}>
                                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                                    <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/add-product")}>Add Product</Typography>
                                </motion.div>
                                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                                    <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/products")}>Show Products</Typography>
                                </motion.div>
                            </Stack>
                        )}
                    </Stack>
                    <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/brands")}>Brands</Typography>
                    <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/categories")}>Categories</Typography>
                    <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/orders")}>Orders</Typography>
                </Stack>
            </motion.div>

            <Stack rowGap={5} mt={is600 ? 2 : 5} mb={'3rem'}>
                <Stack flexDirection={'row'} mr={'2rem'} justifyContent={'flex-end'} alignItems={'center'} columnGap={5}>

                    <FormControl sx={{ minWidth: 120 }}>
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

                <Grid spacing={3} gap={2} container flex={1} justifyContent={'center'} alignContent={'center'}>
                    {(products ?? []).map((product) => (
                        <Stack
                            key={product._id}
                            spacing={2}
                            sx={{
                                opacity: product.isDeleted ? 0.2 : 1,
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                p: 2,
                                backgroundColor: '#fff',
                                boxShadow: 2,
                                transition: 'all 0.3s',
                            }}
                        >
                            <ProductCard
                                id={product._id}
                                title={product.title}
                                thumbnail={product.thumbnail}
                                brand={product.brand.name}
                                price={product.price}
                                discountPercentage={product.discountPercentage}
                                isAdminCard={true}
                            />

                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                spacing={is488 ? 1 : 2}
                            >
                                <Button
                                    component={Link}
                                    to={`/admin/product-update/${product._id}`}
                                    variant="contained"
                                >
                                    Update
                                </Button>
                                {product.isDeleted ? (
                                    <Button
                                        onClick={() => handleProductUnDelete(product._id)}
                                        color="success"
                                        variant="outlined"
                                    >
                                        Restore
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleProductDelete(product._id)}
                                        color="error"
                                        variant="outlined"
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    ))}

                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">No</Button>
                            <Button onClick={confirmDeleteProduct} color="error">Yes, Delete</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                <Stack alignSelf={is488 ? 'center' : 'flex-end'} mr={is488 ? 0 : 5} rowGap={2} p={is488 ? 1 : 0}>
                    <Pagination size={is488 ? 'medium' : 'large'} page={page} onChange={(e, value) => setPage(value)} count={Math.ceil(totalResults / ITEMS_PER_PAGE)} variant="outlined" shape="rounded" />
                    <Typography textAlign={'center'}>Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results</Typography>
                </Stack>
            </Stack>
        </>
    );
};