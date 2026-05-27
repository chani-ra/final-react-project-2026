import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser as loginAction } from "../../redux/slices/authSlice";
import { loginUser } from "../../services/authService";

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;

  const normalizedId = rawUser.id || rawUser._id || rawUser.userId;

  return {
    ...rawUser,
    id: normalizedId,
    _id: rawUser._id || normalizedId,
    username: rawUser.username || rawUser.name || "משתמש",
    role: rawUser.role,
    favoriteHobbies: rawUser.favoriteHobbies || [],
    expectations: rawUser.expectations || [],
    englishLevel: rawUser.englishLevel || "beginner",
  };
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      const normalizedUser = normalizeUser(data.user);

      console.group("🔐 Login Debug");
      console.log("Full server response:", data);
      console.log("Raw user from server:", data.user);
      console.log("Normalized user:", normalizedUser);
      console.log("User ID:", normalizedUser?.id);
      console.log("User role:", normalizedUser?.role);
      console.groupEnd();

      if (!normalizedUser?.id) {
        throw new Error("התחברות הצליחה, אבל השרת לא החזיר מזהה משתמש");
      }

      if (!normalizedUser?.role) {
        throw new Error("התחברות הצליחה, אבל השרת לא החזיר תפקיד משתמש");
      }

      dispatch(loginAction(normalizedUser));

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken || "");
      localStorage.setItem("userRole", normalizedUser.role);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      if (normalizedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (normalizedUser.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(typeof err === "string" ? err : err.message || "שגיאה בהתחברות");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950" dir="rtl">
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          התחברות למערכת 🚀
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              אימייל
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              סיסמה
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg mt-4 ${
              isLoading
                ? "bg-indigo-500/50 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isLoading ? "מתחבר לשרת..." : "היכנס למערכת"}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-yellow-400 hover:text-yellow-300 font-bold text-sm hover:underline"
          >
            אין לך חשבון? התחלת הרשמה
          </button>
        </div>
      </div>
    </div>
  );
}