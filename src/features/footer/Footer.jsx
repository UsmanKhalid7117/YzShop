import {
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  SvgIcon,
  Tooltip,
  Box,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion, MotionConfig } from 'framer-motion';
import logo from './../../assets/images/yzlogo.jpg';

// Custom TikTok Icon
function TikTokIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12.75 2h2.25a5.25 5.25 0 0 0 5.25 5.25v2.25a7.5 7.5 0 0 1-4.5-1.44v7.44a6.75 6.75 0 1 1-6.75-6.75 6.67 6.67 0 0 1 1.5.17V11.3a2.25 2.25 0 1 0 1.5 2.12V2z" />
    </SvgIcon>
  );
}

export const Footer = () => {
  const theme = useTheme();
  const is700 = useMediaQuery(theme.breakpoints.down(700));

  const labelStyles = {
    fontWeight: 300,
    cursor: 'pointer',
  };

  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.primary.main,
        paddingTop: '3rem',
        paddingLeft: is700 ? '1rem' : '3rem',
        paddingRight: is700 ? '1rem' : '3rem',
        paddingBottom: '1.5rem',
        rowGap: '5rem',
        color: theme.palette.primary.light,
        justifyContent: 'space-around',
      }}
    >
      {/* Upper Section */}
      <Stack
        flexDirection={'row'}
        rowGap={'1rem'}
        justifyContent={is700 ? '' : 'space-around'}
        flexWrap={'wrap'}
      >

      <Stack alignItems="center" rowGap={'1rem'}>
  <Box
    component="img"
    src={logo}
    alt="YZ Logo"
    sx={{
      width: { xs: '60px', sm: '80px', md: '100px' },
      height: 'auto',
      maxHeight: '120px',
      objectFit: 'contain',
    }}
  />
</Stack>



        {/* Support */}
        <Stack rowGap={'1rem'} padding={'1rem'}>
          <Typography variant="h6">Support</Typography>
          <Typography sx={labelStyles}>
            Mator Chock Raja Market Near Sadaqat Hospital, Kahuta.
          </Typography>
          <Typography sx={labelStyles}>yzmobilelaptop@gmail.com</Typography>
          <Typography sx={labelStyles}>+92-3315096757</Typography>
        </Stack>

                {/* About Section */}
        <Stack rowGap={'1rem'} padding={'1rem'} alignItems={'flex-start'}>
       
          <Typography variant="h6">About</Typography>
          <Typography sx={labelStyles} maxWidth={300}>
            YZ Shop offers a wide range of mobiles, laptops, and accessories. We are committed to providing high-quality products and excellent customer service in the heart of Kahuta.
          </Typography>
        </Stack>

        {/* Social Icons */}
        <Stack rowGap={'1rem'} padding={'1rem'}>
          <Typography variant="h6">Follow Us</Typography>

          <Stack mt={0.6} flexDirection="row" columnGap="2rem">
            <MotionConfig whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
              {/* TikTok */}
              <Tooltip title="Follow us on TikTok" arrow>
                <motion.a
                  href="https://www.tiktok.com/@yz_mobile_laptop_shop?_t=ZN-8y4YVVhpCze&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TikTokIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.light,
                      cursor: 'pointer',
                    }}
                  />
                </motion.a>
              </Tooltip>

              {/* WhatsApp */}
              <Tooltip title="Chat on WhatsApp" arrow>
                <motion.a
                  href="https://wa.me/923315096757?text=Hi%20there!%20I'm%20interested%20in%20your%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon
                    sx={{
                      fontSize: 32,
                      color: '#25D366',
                      cursor: 'pointer',
                    }}
                  />
                </motion.a>
              </Tooltip>
            </MotionConfig>
          </Stack>
        </Stack>
      </Stack>

      {/* Lower Section */}
      <Stack alignSelf={'center'}>
        <Typography color={'GrayText'}>
          &copy; YZ Shop {new Date().getFullYear()}. All rights reserved by YZ Shop.
        </Typography>
      </Stack>
    </Stack>
  );
};
