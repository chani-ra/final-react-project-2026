import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReviewsSection from "../features/reviews/ReviewsSection";
import skyJourneyBackground from "../assets/sky-journey-background.svg";

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(
    isAuthenticated || user || localStorage.getItem("token")
  );

  const goToUserArea = () => {
    if (user?.role === "teacher") {
      navigate("/teacher/dashboard");
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#55b9ef] text-white"
      dir="rtl"
    >
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${skyJourneyBackground})` }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-[#0b5e9b]/8 via-[#0b4f88]/10 to-[#062e52]/35" />

      <Header
        isLoggedIn={isLoggedIn}
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
        onUserArea={goToUserArea}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-7 md:pt-10">
        <HeroSection
          isLoggedIn={isLoggedIn}
          onStart={isLoggedIn ? goToUserArea : () => navigate("/register")}
          onLogin={() => navigate("/login")}
        />

        <AboutSection />

        <ExperienceSection />

        <ForWhoSection />
      </main>

      <ReviewsSection />

      <Footer />
    </div>
  );
}

function Header({ isLoggedIn, onLogin, onRegister, onUserArea }) {
  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border-2 border-white/28 bg-[#061f36]/72 px-5 py-3 shadow-[0_18px_55px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
        <button
          type="button"
          className="text-2xl font-black tracking-tight text-white md:text-3xl"
        >
          EnglishWise
        </button>

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              type="button"
              onClick={onUserArea}
              className="rounded-full border-2 border-[#ffd439]/70 bg-[#ffd439] px-5 py-2.5 text-sm font-black text-[#123c6b] shadow-[0_6px_0_rgba(111,82,0,0.26)] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none"
            >
              לאזור האישי
            </button>
          )}

          <button
            type="button"
            onClick={onLogin}
            className="rounded-full border-2 border-white/35 bg-white/10 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/18"
          >
            התחברות
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-6 py-2.5 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.40)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
          >
            הרשמה
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ isLoggedIn, onStart, onLogin }) {
  return (
    <section className="relative overflow-hidden rounded-[2.8rem] border-2 border-white/30 bg-[#123c6b]/82 shadow-[0_34px_105px_rgba(3,31,61,0.42),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
      <DecorativeLines />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_90%_100%,rgba(255,212,57,0.13),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_58%)]" />

      <div className="relative z-10 grid gap-8 p-6 md:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:p-11">
        <div className="flex flex-col justify-center">
          <div className="mb-5 w-fit rounded-full border border-[#ffd439]/45 bg-[#ffd439]/16 px-5 py-2 text-sm font-extrabold text-[#ffe89a]">
            לימוד אנגלית שמתקדם איתך
          </div>

          <h1
            className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.48), -1px -1px 0 rgba(15,76,117,0.95), 0 18px 38px rgba(7,89,133,0.38)",
            }}
          >
            ללמוד אנגלית
            <br />
            בלי ללכת לאיבוד
          </h1>

          <p className="mt-6 max-w-3xl text-lg font-semibold leading-9 text-white/80 md:text-xl">
            EnglishWise מרכז עבורך את כל מה שצריך כדי להתקדם באנגלית:
            מסלול אישי, שיעורים, תרגול, כתיבה, מילון, משימות וכלי AI שמכוון
            אותך לצעד הבא. לא עוד חומר מפוזר — אלא חוויית למידה ברורה,
            מסודרת ומותאמת.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-4 text-base font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
            >
              {isLoggedIn ? "המשיכי ללמוד" : "התחילי עכשיו"}
            </button>

            {!isLoggedIn && (
              <button
                type="button"
                onClick={onLogin}
                className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-black text-white transition hover:bg-white/18"
              >
                כבר יש לי חשבון
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <HeroMiniCard
            eyebrow="התחלה אישית"
            title="כל תלמידה נכנסת למסלול שמתאים לה"
            text="המערכת מתחשבת ברמה, גיל, תחומי עניין ומטרות, כדי שהלמידה לא תרגיש כללית מדי."
          />

          <HeroMiniCard
            eyebrow="למידה פעילה"
            title="לא רק לצ"
            text="שיעורים, משימות, בחנים, מילון וכתיבה מתחברים למסלול אחד ברור, בלי עומס מיותר."
            highlight
          />

          <HeroMiniCard
            eyebrow="כלי AI"
            title="עזרה חכמה כשנתקעים"
            text="האתר עוזר לזהות מה חסר, מה כדאי לחזק ומה הצעד הבא בלמידה."
          />
        </div>
      </div>
    </section>
  );
}

function HeroMiniCard({ eyebrow, title, text, highlight = false }) {
  return (
    <article
      className={`rounded-[2rem] border-2 p-5 shadow-[0_22px_70px_rgba(3,31,61,0.30),inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-xl ${
        highlight
          ? "border-[#ffd439]/55 bg-[#ffd439]/13"
          : "border-white/24 bg-[#061f36]/64"
      }`}
    >
      <p
        className={`text-sm font-extrabold ${
          highlight ? "text-[#ffe89a]" : "text-white/58"
        }`}
      >
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black leading-tight text-white">
        {title}
      </h2>

      <p className="mt-3 text-base font-semibold leading-8 text-white/72">
        {text}
      </p>
    </article>
  );
}

function AboutSection() {
  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-[2.5rem] border-2 border-white/28 bg-[#061f36]/66 p-7 text-white shadow-[0_28px_85px_rgba(3,31,61,0.34),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:p-8">
        <p className="text-sm font-extrabold text-[#ffe89a]">אודותינו</p>

        <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
          אתר שנבנה בשביל ללמוד באמת,
          <br />
          לא רק לסמן וי
        </h2>
      </article>

      <article className="rounded-[2.5rem] border-2 border-[#2c8fd6]/55 bg-[#123c6b]/78 p-7 text-white shadow-[0_28px_85px_rgba(3,31,61,0.34),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:p-8">
        <p className="text-lg font-semibold leading-9 text-white/78">
          EnglishWise נולד מתוך צורך פשוט: להפוך את לימוד האנגלית למשהו
          מסודר, נגיש ומתקדם. במקום שתלמידה תרגיש שיש לה יותר מדי חומרים
          ופחות מדי כיוון, האתר בונה עבורה חוויה שלמה — מהיכרות ראשונית עם
          הרמה שלה, דרך תרגול וליווי, ועד תחושת התקדמות אמיתית.
        </p>

        <p className="mt-5 text-lg font-semibold leading-9 text-white/78">
          זה אתר שמחבר בין תלמידות, מורות ומנהלים במקום אחד: תלמידה לומדת,
          מורה יוצרת ומנהלת תוכן, והמנהל שומר על סדר במערכת. הכול עטוף
          בממשק ברור ונעים, כך שהלמידה לא נראית כמו מטלה — אלא כמו מסע
          שאפשר להמשיך בו בביטחון.
        </p>
      </article>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="mt-8 rounded-[2.5rem] border-2 border-white/28 bg-[#123c6b]/80 p-6 shadow-[0_30px_95px_rgba(3,31,61,0.36),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        <FeaturePanel
          title="מסלול שמבין את המשתמשת"
          text="המערכת לא מסתפקת בהצגת חומר. היא מנסה להבין מי לומדת, מה הרמה שלה, מה מעניין אותה ולאן היא רוצה להגיע."
        />

        <FeaturePanel
          title="מקום אחד לכל הלמידה"
          text="קורסים, שיעורים, שירים, משימות, בחנים, מילון וצ׳אט לימודי מתחברים לאזור אחד, כך שהלמידה נשארת מסודרת."
        />

        <FeaturePanel
          title="חוויה שנשארת ברורה"
          text="המידע לא נשפך על המסך בבת אחת. בכל אזור רואיםחים פירוט רק כשצריך."
        />
      </div>
    </section>
  );
}

function FeaturePanel({ title, text }) {
  return (
    <article className="rounded-[2rem] border-2 border-[#2c8fd6]/50 bg-[#061f36]/58 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <h3 className="text-2xl font-black leading-tight text-white">{title}</h3>

      <p className="mt-4 text-base font-semibold leading-8 text-white/72">
        {text}
      </p>
    </article>
  );
}

function ForWhoSection() {
  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-3">
      <AudienceCard
        label="לתלמידות"
        title="לראות מה ללמוד עכשיו"
        text="התלמידה מקבלת קורסים, משימות, מילון אישי, תרגול וכתיבה — עם תחושה שיש לה דרך ולא רק רשימת משימות."
      />

      <AudienceCard
        label="למורות"
        title="לבנות תוכן בצורה מסודרת"
        text="המורה יכולה להעלות שיעורים, ליצור תרגילים ובחנים, לארגן תכנים וללוות את התלמידות בצורה ברורה."
        strong
      />

      <AudienceCard
        label="למנהלים"
        title="לשמור על מערכת מאורגנת"
        text="המנהל מקבל מבט רחב על משתמשים, תכנים, הודעות וניהול אזורים חשובים באתר."
      />
    </section>
  );
}

function AudienceCard({ label, title, text, strong = false }) {
  return (
    <article
      className={`rounded-[2.4rem] border-2 p-6 shadow-[0_26px_80px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl ${
        strong
          ? "border-[#ffd439]/55 bg-[#ffd439]/13"
          : "border-white/26 bg-[#123c6b]/74"
      }`}
    >
      <p
        className={`text-sm font-extrabold ${
          strong ? "text-[#ffe89a]" : "text-white/60"
        }`}
      >
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-black leading-tight text-white">
        {title}
      </h3>

      <p className="mt-4 text-base font-semibold leading-8 text-white/72">
        {text}
      </p>
    </article>
  );
}

function DecorativeLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-14"
      viewBox="0 0 1200 420"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M-20 330 C150 250 250 310 405 210 C555 112 650 168 805 95 C950 28 1050 82 1230 20"
          strokeWidth="4"
        />
        <path
          d="M-30 390 C130 320 270 350 420 270 C570 190 690 220 850 160 C990 108 1075 125 1230 80"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-5 pb-8">
      <div className="rounded-[2rem] border-2 border-white/18 bg-[#061f36]/58 px-6 py-5 text-center text-sm font-bold text-white/62 shadow-[0_20px_60px_rgba(3,31,61,0.24)] backdrop-blur-xl">
        © 2026 EnglishWise — לימוד אנגלית בדרך חכמה, אישית וברורה
      </div>
    </footer>
  );
}