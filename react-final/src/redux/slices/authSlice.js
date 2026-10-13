import { createSlice } from "@reduxjs/toolkit";

const hasStoredSession = Boolean(
  localStorage.getItem("token") || localStorage.getItem("refreshToken")
);

const initialState = {
  user: null,
  isAuthenticated: false,
  status: hasStoredSession ? "checking" : "guest",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },
    restoreSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },
    retrySessionCheck: (state) => {
      state.status = "checking";
    },
    sessionCheckFailed: (state) => {
      state.status = "error";
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "guest";
    },
  },
});

export const {
  registerUser,
  loginUser,
  restoreSession,
  retrySessionCheck,
  sessionCheckFailed,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;
