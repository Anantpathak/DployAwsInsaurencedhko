export const addToWishlist = (item) => ({
    type: 'ADD_TO_WISHLIST',
    payload: item
  });
  
  export const removeFromWishlist = (item) => ({
    type: 'REMOVE_FROM_WISHLIST',
    payload: item
  });
  