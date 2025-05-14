// store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import userReducer from "./reducers/userReducer";
const store = configureStore({ reducer: rootReducer, user: userReducer });
export default store;
