import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    loginUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;