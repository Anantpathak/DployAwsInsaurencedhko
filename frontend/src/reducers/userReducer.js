import { createSlice } from "@reduxjs/toolkit";

// Create a slice for user information
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    isLogin: false,
    userDetails: null,
  },
  reducers: {
    // Reducer to handle login
    login: (state, action) => {
      state.isLogin = true;
      state.userDetails = action.payload; // Update user details with the payload
    },
    // Reducer to handle logout
    logout: (state) => {
      state.isLogin = false;
      state.userDetails = null; // Clear user details on logout
    },
  },
});

// Export the actions
export const { login, logout } = userInfoSlice.actions;

// Export the reducer
export default userInfoSlice.reducer;
