import axiosConfig from './axiosConfig';

// פונקציית התחברות
export const loginUser = async (email, password) => {
    try {
        // שולחים בקשת POST לנתיב ההתחברות בשרת שלך
const response = await axiosConfig.post('/users/login', { email, password });        return response.data; // השרת אמור להחזיר לנו טוקן ופרטי משתמש
    } catch (error) {
        // במידה ויש שגיאה (למשל סיסמה שגויה), נזרוק אותה החוצה כדי להציג למשתמש
        throw error.response?.data?.message || 'שגיאה בהתחברות לשרת';
    }
};