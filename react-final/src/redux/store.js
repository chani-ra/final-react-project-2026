import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // מחברים את החלק של המשתמש לתיק הראשי

export const store = configureStore({
  reducer: {
    auth: authReducer // מחברים את החלק של המשתמש לתיק הראשי
    // בהמשך נוסיף כאן גם את courses: coursesReducer וכו'
  }
});