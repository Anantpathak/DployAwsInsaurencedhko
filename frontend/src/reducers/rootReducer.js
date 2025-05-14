// rootReducer.js
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import wishlistReducer from "./wishlistReducer";
import cartReducer from "./cartReducer";
import currentProductReducer from "./currentProductReducer";

const rootReducer = combineReducers({
  user: userReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  currentProduct: currentProductReducer,
});

export default rootReducer;
