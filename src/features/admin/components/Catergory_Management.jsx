import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Stack, Box
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import {
  addCategoryAsync,
  deleteCategoryAsync,
  fetchAllCategoriesAsync,
  updateCategoryAsync,
  selectCategories
} from '../../categories/CategoriesSlice';

export const CategoryManagement = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  const handleAddOrEdit = () => {
    if (editId) {
      dispatch(updateCategoryAsync({ id: editId, name: categoryName }));
    } else {
      dispatch(addCategoryAsync({ name: categoryName }));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteCategoryAsync(id));
  };

  const handleOpen = (category = null) => {
    if (category) {
      setEditId(category._id);
      setCategoryName(category.name);
    } else {
      setEditId(null);
      setCategoryName('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCategoryName('');
    setEditId(null);
  };

  return (
    <div style={{ padding: '30px' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 style={{ margin: 0 }}>Categories</h2>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Add Category
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
                <TableCell>Category Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(category)}><Edit fontSize="small" /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(category._id)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Add/Edit Category Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
