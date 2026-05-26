import { createSlice } from '@reduxjs/toolkit';

// 1. קריאת הנתונים מהזיכרון המקומי ברגע שהדפדפן טוען את האפליקציה
const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const storedToken = localStorage.getItem('token');

// 2. הגדרת המצב ההתחלתי עם הנתונים שנשמרו (אם קיימים)
const initialState = {
  user: storedUser,
  isAuthenticated: !!storedToken
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // החזרנו את ההרשמה!
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
      
      // ניקוי יסודי של הזיכרון בעת התנתקות יזומה
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    }
  }
});

// מייצאים עכשיו את כל שלוש הפעולות
export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;