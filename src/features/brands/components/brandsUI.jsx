import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductsByBrand,
  clearProductsByBrand,
} from '../../products/ProductSlice';
import { ProductCard } from '../../products/components/ProductCard';
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  selectWishlistItems,
} from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';

const BrandUI = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products || {});
  const { productsByBrand = [], status = 'idle' } = productsState;

  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);

  useEffect(() => {
    if (name) {
      dispatch(clearProductsByBrand());
      dispatch(fetchProductsByBrand(name));
    }
  }, [name, dispatch]);

  const handleAddRemoveFromWishlist = (e, productId) => {
    e.stopPropagation();
    const existing = wishlistItems.find((item) => item.product._id === productId);
    if (existing) {
      dispatch(deleteWishlistItemByIdAsync(existing._id));
    } else {
      dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: productId }));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>
        Brand / {name}
      </h2>

      {status === 'loading' && <p>Loading...</p>}
      {status !== 'loading' && productsByBrand.length === 0 && (
        <p>No products found in this brand.</p>
      )}
      {status !== 'loading' && productsByBrand.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {productsByBrand.map((product) => {
            const { _id, title, price, discountPercentage, thumbnail, brand, stockQuantity } = product;
            const discount = discountPercentage || 0;
            const discountedPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

            return (
              <ProductCard
                key={_id}
                id={_id}
                title={title}
                price={price}
                discountedPrice={discountedPrice}
                discountPercentage={discount}
                thumbnail={thumbnail}
                brand={brand?.name || brand}
                stockQuantity={stockQuantity || 0}
                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                isAdminCard={false}
                isWishlistCard={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrandUI;
