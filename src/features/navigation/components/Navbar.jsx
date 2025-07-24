import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';

// Large Logo
import logo from "../../../assets/images/yz_logo1.jpg";

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };

  const settings = [
    ...(!loggedInUser?.isAdmin ? [{ name: "Home", to: "/" }] : []),
    ...(!loggedInUser?.isAdmin ? [{ name: "Profile", to: "/profile" }] : []),
    ...(!loggedInUser?.isAdmin ? [{ name: "Orders", to: "/orders" }] : []),
    { name: 'Logout', to: "/logout" },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", boxShadow: "none", color: "text.primary" }}>
      <Toolbar sx={{ p: 1, height: "5rem", display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center">
          <img
            src={logo}
            alt="Logo"
            style={{ height: '70px', marginRight: '10px', objectFit: 'contain' }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            YZ SHOP
          </Typography>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} columnGap={2}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={userInfo?.name || "User"} src={null} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.to} onClick={handleCloseUserMenu}>
                <Typography
                  component={Link}
                  color={'text.primary'}
                  sx={{ textDecoration: "none" }}
                  to={setting.to}
                  textAlign="center"
                >
                  {setting.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          {userInfo?.name && (
            <Typography variant='h6' fontWeight={300}>
              {is480 ? userInfo.name.split(" ")[0] : `Hey👋, ${userInfo.name}`}
            </Typography>
          )}

          {loggedInUser?.isAdmin && <Button variant='contained'>Admin</Button>}

          <Stack direction="row" columnGap="1rem" alignItems="center" justifyContent="center">
            {cartItems?.length > 0 && (
              <Badge badgeContent={cartItems.length} color='error'>
                <IconButton onClick={() => navigate("/cart")}>
                  <ShoppingCartOutlinedIcon />
                </IconButton>
              </Badge>
            )}

            {!loggedInUser?.isAdmin && (
              <Badge badgeContent={wishlistItems?.length} color='error'>
                <IconButton component={Link} to={"/wishlist"}>
                  <FavoriteBorderIcon />
                </IconButton>
              </Badge>
            )}

            {isProductList && (
              <IconButton onClick={handleToggleFilters}>
                <TuneIcon sx={{ color: isProductFilterOpen ? "black" : "" }} />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
