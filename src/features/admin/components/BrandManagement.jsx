import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Stack, Box
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBrandAsync,
  deleteBrandAsync,
  fetchAllBrandsAsync,
  selectBrands,
  updateBrandAsync
} from '../../brands/BrandSlice';

export const BrandManagement = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);

  const [open, setOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
  }, [dispatch]);

  const handleAddOrEdit = () => {
    if (editId) {
      dispatch(updateBrandAsync({ id: editId, name: brandName }));
    } else {
      dispatch(addBrandAsync({ name: brandName }));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteBrandAsync(id));
  };

  const handleOpen = (brand = null) => {
    if (brand) {
      setEditId(brand._id);
      setBrandName(brand.name);
    } else {
      setEditId(null);
      setBrandName('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBrandName('');
    setEditId(null);
  };

  return (
    <div style={{ padding: '30px' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 style={{ margin: 0 }}>Brands</h2>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Add Brand
          </Button>
        </Stack>

        <Box
          sx={{
            maxHeight: 400,
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Brand Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand, index) => (
                <TableRow key={brand._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(brand)}><Edit fontSize="small" /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(brand._id)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Add/Edit Brand Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddOrEdit} variant="contained">
              {editId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
};
