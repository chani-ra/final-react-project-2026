import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,         // כאן יישמרו השם, הגיל, המגדר וכו' אחרי ההרשמה
  isAuthenticated: false // האם המשתמש מחובר כרגע למערכת
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // פונקציה שמקבלת את נתוני הילד ושומרת אותם ברידקס הכללי
    registerUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // פונקציית התנתקות (נצטרך בהמשך)
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { registerUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;