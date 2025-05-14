const initialState = {
  wishlistItems: [],
  wishlistCounter: 0,
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlistItems: [...state.wishlistItems, action.payload],
        wishlistCounter: state.wishlistCounter + 1, // Increment wishlist counter when item is added
      };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (item) => item !== action.payload
        ),
        wishlistCounter: state.wishlistCounter - 1, // Decrement wishlist counter when item is removed
      };
    case "INCREMENT_WISHLIST_COUNTER":
      return {
        ...state,
        wishlistCounter: state.wishlistCounter + 1, // Increment wishlist counter
      };
    case "DECREMENT_WISHLIST_COUNTER":
      return {
        ...state,
        wishlistCounter: state.wishlistCounter - 1, // Decrement wishlist counter
      };
    default:
      return state;
  }
};

export default wishlistReducer;
