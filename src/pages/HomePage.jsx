import React, { useEffect } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { ProductList } from '../features/products/components/ProductList'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Footer } from '../features/footer/Footer'

export const HomePage = () => {
  const dispatch = useDispatch()
  const addressStatus = useSelector(selectAddressStatus)

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      dispatch(resetAddressStatus())
    }
  }, [addressStatus])

  return (
    <>
      <Navbar isProductList={true} />
      <ProductList />
      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923315096757?text=Hi%20there!%20I'm%20interested%20in%20your%20products"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
          alt="WhatsApp"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width: '50px',
            height: '50px',
            cursor: 'pointer',
          }}
        />
      </a>
    </>
  )
}
