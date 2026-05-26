import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,          // מתחילים בלי משתמש בכלל
  isAuthenticated: false // אף אחד לא מחובר בהתחלה
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      // כאן הסוד: אנחנו לוקחים בדיוק את מה שהכפתור בדף ההתחברות שולח אלינו!
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { registerUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;