export const addToCart = (item) => ({
  type: 'ADD_TO_CART',
  payload: item
});

export const removeFromCart = (item) => ({
  type: 'REMOVE_FROM_CART',
  payload: item
});

export const incrementCartCounter = () => ({
  type: 'INCREMENT_CART_COUNTER'
});

export const decrementCartCounter = () => ({
  type: 'DECREMENT_CART_COUNTER'
});
