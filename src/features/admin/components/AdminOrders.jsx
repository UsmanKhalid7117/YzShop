import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllOrdersAsync,
  resetOrderUpdateStatus,
  selectOrderUpdateStatus,
  selectOrders,
  updateOrderByIdAsync,
} from '../../order/OrderSlice'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import {
  Avatar,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { toast } from 'react-toastify'
import Lottie from 'lottie-react'
import { noOrdersAnimation } from '../../../assets/index'

export const AdminOrders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus)
  const [editIndex, setEditIndex] = useState(-1)
  const [tempStatus, setTempStatus] = useState('') // Track status for edited row
  const [viewOrder, setViewOrder] = useState(null)

  const theme = useTheme()
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    dispatch(getAllOrdersAsync())
  }, [dispatch])

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      toast.success('Status updated')
    } else if (orderUpdateStatus === 'rejected') {
      toast.error('Error updating order status')
    }
  }, [orderUpdateStatus])

  useEffect(() => {
    return () => {
      dispatch(resetOrderUpdateStatus())
    }
  }, [])

  const handleEditClick = (index) => {
    setEditIndex(index)
    setTempStatus(orders[index].status) // Initialize with current status
  }

  const handleStatusChange = (e) => {
    setTempStatus(e.target.value)
  }

  const handleUpdateOrder = (index) => {
    if (editIndex !== index) return
    
    const update = {
      status: tempStatus,
      _id: orders[index]._id
    }
    setEditIndex(-1)
    dispatch(updateOrderByIdAsync(update))
  }

  const editOptions = ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled']

  const getStatusColor = (status) => {
    if (status === 'Pending') return { bgcolor: '#dfc9f7', color: '#7c59a4' }
    if (status === 'Dispatched') return { bgcolor: '#feed80', color: '#927b1e' }
    if (status === 'Out for delivery') return { bgcolor: '#AACCFF', color: '#4793AA' }
    if (status === 'Delivered') return { bgcolor: '#b3f5ca', color: '#548c6a' }
    if (status === 'Cancelled') return { bgcolor: '#fac0c0', color: '#cc6d72' }
  }

  return (
    <Stack alignItems="center" sx={{ width: '100%', overflowX: 'auto', px: 1 }}>
      <Stack
        mt={3}
        sx={{
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        {orders.length ? (
          <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
            <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Id</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Phone No.</TableCell>
                  <TableCell>Shipping</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => {
                  const groupedProducts = Object.values(
                    order.item.reduce((acc, { product }) => {
                      const id = product._id
                      if (!acc[id]) {
                        acc[id] = { ...product, quantity: 1 }
                      } else {
                        acc[id].quantity += 1
                      }
                      return acc
                    }, {})
                  )

                  const fullAddress = [
                    order.address[0]?.street,
                    order.address[0]?.city,
                    order.address[0]?.state,
                    order.address[0]?.postalCode,
                    order.address[0]?.country,
                  ]
                    .filter(Boolean)
                    .join(', ')

                  return (
                    <TableRow key={order._id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{order._id.slice(-5)}</TableCell>

                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Tooltip
                          title={
                            <Stack>
                              {groupedProducts.map((p) => (
                                <Typography key={p._id} fontSize="0.75rem">{p.title} (x{p.quantity})</Typography>
                              ))}
                            </Stack>
                          }
                        >
                          <Stack spacing={0.5}>
                            {groupedProducts.slice(0, 1).map((product) => (
                              <Stack
                                key={product._id}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar src={product.thumbnail} sx={{ width: 24, height: 24 }} />
                                <Typography fontSize="0.75rem" noWrap>
                                  {product.title} (x{product.quantity})
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="right">
                        <Typography fontSize="0.75rem">Rs {order.total}</Typography>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography fontSize="0.75rem">
                          {order.address[0]?.phoneNumber}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Tooltip title={fullAddress}>
                          <Typography fontSize="0.75rem" noWrap>
                            {fullAddress}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography fontSize="0.75rem">{order.paymentMode}</Typography>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography fontSize="0.75rem">
                          {new Date(order.createdAt).toDateString()}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {editIndex === index ? (
                          <FormControl fullWidth size="small">
                            <InputLabel id="status-label">Update</InputLabel>
                            <Select
                              value={tempStatus}
                              labelId="status-label"
                              label="Update"
                              onChange={handleStatusChange}
                            >
                              {editOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Chip
                            label={order.status}
                            sx={{
                              ...getStatusColor(order.status),
                              height: 24,
                              fontSize: '0.7rem',
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {editIndex === index ? (
                            <IconButton 
                              onClick={() => handleUpdateOrder(index)} 
                              size="small"
                            >
                              <CheckCircleOutlinedIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <>
                              <IconButton onClick={() => handleEditClick(index)} size="small">
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                              <IconButton onClick={() => setViewOrder(order)} size="small">
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack width={is480 ? 'auto' : '25rem'} justifyContent="center" alignItems="center">
            <Lottie animationData={noOrdersAnimation} style={{ height: 200 }} />
            <Typography textAlign="center" variant="body2" fontWeight={400}>
              There are no orders currently
            </Typography>
          </Stack>
        )}
      </Stack>
      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'auto',
            p: 3,
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6">Order Details</Typography>
            <Typography><strong>Order ID:</strong> {viewOrder?._id}</Typography>
            <Typography><strong>Status:</strong> {viewOrder?.status}</Typography>
            <Typography><strong>Total:</strong> Rs {viewOrder?.total}</Typography>
            <Typography><strong>Phone:</strong> {viewOrder?.address[0]?.phoneNumber}</Typography>
            <Typography><strong>Shipping Address:</strong> {[viewOrder?.address[0]?.street, viewOrder?.address[0]?.city, viewOrder?.address[0]?.state, viewOrder?.address[0]?.postalCode, viewOrder?.address[0]?.country].filter(Boolean).join(', ')}</Typography>
            <Typography><strong>Payment Mode:</strong> {viewOrder?.paymentMode}</Typography>
            <Typography><strong>Order Date:</strong> {new Date(viewOrder?.createdAt).toDateString()}</Typography>

            <Typography><strong>Items:</strong></Typography>
            {(() => {
              const groupedProducts = Object.values(
                viewOrder?.item?.reduce((acc, { product }) => {
                  const id = product._id
                  if (!acc[id]) {
                    acc[id] = { ...product, quantity: 1 }
                  } else {
                    acc[id].quantity += 1
                  }
                  return acc
                }, {}) || {}
              )

              return groupedProducts.map((product) => (
                <Stack key={product._id} direction="row" spacing={1} alignItems="center">
                  <Avatar src={product.thumbnail} sx={{ width: 24, height: 24 }} />
                  <Typography fontSize="0.85rem">
                    {product.title} (x{product.quantity})
                  </Typography>
                </Stack>
              ))
            })()}

            <Button onClick={() => setViewOrder(null)} variant="contained" color="primary">
              Close
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </Stack>
  )
}