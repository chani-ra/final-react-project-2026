import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser as loginAction } from "../../redux/slices/authSlice";
import { loginUser } from "../../services/authService";
import { getHomePathForRole, saveAuthSession } from "../../services/authSession";
import skyJourneyBackground from "../../assets/sky-journey-background.svg";

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
      const user = saveAuthSession(data.user, data.token, data.refreshToken);
      dispatch(loginAction(user));
      navigate(getHomePathForRole(user.role));
    } catch (err) {
      console.error("Login error:", err);
      setError(typeof err === "string" ? err : err.message || "שגיאה בהתחברות");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-sky-500 text-white"
      dir="rtl"
    >
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${skyJourneyBackground})` }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-sky-900/10 via-blue-900/20 to-slate-950/55" />

      <header className="relative z-20 px-5 py-5">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border-2 border-white/25 bg-slate-950/55 px-5 py-3 backdrop-blur-xl"
          style={{
            boxShadow:
              "0 18px 55px rgba(3,31,61,0.38), inset 0 1px 0 rgba(255,255,255,0.16)",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-tight text-white md:text-3xl"
          >
            EnglishWise
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full border-2 border-white/25 bg-white/10 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/20"
            >
              דף הבית
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-2.5 text-sm font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1"
              style={{
                boxShadow: "0 6px 0 rgba(89,15,20,0.40)",
              }}
            >
              הרשמה
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-110px)] max-w-6xl items-center px-5 pb-10">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <section
            className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/25 bg-blue-950/75 p-7 text-white backdrop-blur-xl md:p-9"
            style={{
              boxShadow:
                "0 32px 95px rgba(3,31,61,0.40), inset 0 1px 0 rgba(255,255,255,0.16)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

            <div className="relative z-10">
              <p className="mb-4 w-fit rounded-full border border-yellow-300/40 bg-yellow-300/15 px-4 py-2 text-sm font-extrabold text-yellow-100">
                כניסה לאזור האישי
              </p>

              <h1
                className="text-4xl font-black leading-tight text-white md:text-6xl"
                style={{
                  textShadow:
                    "3px 3px 0 rgba(184,50,42,0.48), -1px -1px 0 rgba(15,76,117,0.95), 0 18px 38px rgba(7,89,133,0.38)",
                }}
              >
                חוזרים למסלול
                <br />
                וממשיכים להתקדם
              </h1>

              <p className="mt-5 text-lg font-semibold leading-9 text-white/75">
                התחברות למערכת מחזירה אותך אל הקורסים, המשימות, המילון,
                הכתיבה, ההודעות וכלי הלמידה האישיים שלך.
              </p>
            </div>
          </section>

          <section
            className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/25 bg-slate-950/65 p-6 text-white backdrop-blur-xl md:p-8"
            style={{
              boxShadow:
                "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

            <form onSubmit={handleLogin} className="relative z-10 space-y-5">
              <div>
                <h2 className="text-3xl font-black text-white md:text-4xl">
                  התחברות
                </h2>

                <p className="mt-2 text-base font-semibold text-white/60">
                  הכניסי אימייל וסיסמה כדי להיכנס למערכת.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border-2 border-red-300/35 bg-red-500/15 px-4 py-3 text-sm font-black text-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-black text-white/75">
                  אימייל
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[1.45rem] border-2 border-white/20 bg-white/10 px-5 py-4 text-lg font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-white/75">
                  סיסמה
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[1.45rem] border-2 border-white/20 bg-white/10 px-5 py-4 text-lg font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-8 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  boxShadow: isLoading
                    ? "none"
                    : "0 7px 0 rgba(89,15,20,0.42)",
                }}
              >
                {isLoading ? "מתחבר לשרת..." : "כניסה למערכת"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-8 py-3.5 text-sm font-black text-yellow-100 transition hover:-translate-y-1 hover:bg-yellow-300/25"
              >
                אין לך חשבון? התחלת הרשמה
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}