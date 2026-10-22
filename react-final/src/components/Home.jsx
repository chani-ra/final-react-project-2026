import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReviewsSection from "../features/reviews/ReviewsSection";
import heroBalcony from "../assets/home-motion/hero-balcony.webp";
import flowers from "../assets/home-motion/cta-flowers.webp";
import audienceFlowersLeft from "../assets/home-motion/audience-bloom-left.webp";
import audienceFlowersRight from "../assets/home-motion/audience-bloom-right.webp";
import sceneryClouds from "../assets/home-motion/sky-cloud-mountain.webp";
import journeyFlowersLeft from "../assets/home-motion/journey-lanterns.webp";
import journeyMountainsRight from "../assets/home-motion/journey-village.webp";
import aboutCloudLeft from "../assets/home-motion/about-cloud-left.webp";
import "./home-final.css";
import "./home-atmosphere-v4.css";
import "./home-atmosphere-v5.css";

const audiences = [
  { title: "למשתחררים", copy: "להרגיש בנוח ובביטחון בכל מקום בעולם.", icon: "plane" },
  { title: "למי שאוהב ללמוד", copy: "לחוויית העשרה אישית, מרגשת וביטחון עצמי.", icon: "heart" },
  { title: "לסטודנטים", copy: "להצלחה בלימודים אקדמיים ובמחקר.", icon: "graduation" },
  { title: "לאנשי מקצוע", copy: "לפתוח את הקריירה להצלחה בתקשורת בינלאומית.", icon: "briefcase" },
];

const journey = [
  { number: 1, title: "מתחילים בקלות", copy: "מכירים את האפשרויות ובוחרים את המסלול המתאים.", icon: "flag" },
  { number: 2, title: "לומדים ומתאמנים", copy: "שיעורים מגוונים ומשימות לאורך הדרך.", icon: "book" },
  { number: 3, title: "מקבלים מסלול אישי", copy: "לפי הצרכים והמטרות האישיות שלכם.", icon: "chart" },
  { number: 4, title: "רואים תוצאות", copy: "עוקבים אחר ההתקדמות ושומרים על ביטחון ויכולת בשפה.", icon: "star" },
];

const advantages = [
  { title: "התאמה אישית", copy: "לכל רמה ומטרה", icon: "person" },
  { title: "חוויית למידה", copy: "מהנה ומעוררת", icon: "heart" },
  { title: "כלי AI", copy: "מתקדמים", icon: "spark" },
  { title: "תוכן איכותי", copy: "ואמין", icon: "diamond" },
];

function Icon({ name, size = 23 }) {
  const attrs = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const content = {
    book: <><path d="M12 6C9 4.4 6.4 4.4 3 5v14c3.4-1 6.4-.5 9 1.2C14.6 18.5 17.6 18 21 19V5c-3.4-.6-6-.6-9 1Z"/><path d="M12 6v14"/></>,
    plane: <><path d="m21 3-6.4 18-3.8-7.8L3 9.4 21 3Z"/><path d="m10.8 13.2 4.4-4.4"/></>,
    heart: <path d="M20.5 5.9a5 5 0 0 0-7.1 0L12 7.3l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8a5 5 0 0 0 0-7.1Z"/>,
    graduation: <><path d="m2 9 10-5 10 5-10 5-10-5Z"/><path d="M6 11.5V17c3.6 2.8 8.4 2.8 12 0v-5.5M22 9v7"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12c4 3 14 3 18 0"/></>,
    flag: <><path d="M5 22V4"/><path d="M5 5c5-3 8 3 14 0v11c-6 3-9-3-14 0"/></>,
    chart: <><path d="M4 21h16M7 17V11M12 17V6M17 17V3"/></>,
    star: <path d="m12 2.5 3 6.1 6.8 1-4.9 4.8 1.1 6.8-6-3.2-6 3.2 1.1-6.8-4.9-4.8 6.8-1 3-6.1Z"/>,
    person: <><circle cx="12" cy="7" r="4"/><path d="M4 22c0-5 3.3-8 8-8s8 3 8 8"/></>,
    spark: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/></>,
    diamond: <><path d="m3 9 4-5h10l4 5-9 12L3 9Z"/><path d="M3 9h18M7 4l5 17 5-17"/></>,
    arrow: <><path d="M19 12H5m7-7-7 7 7 7"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
  };
  return <svg {...attrs}>{content[name] || content.spark}</svg>;
}

function Wave({ className = "" }) {
  // Deliberately no opaque polygon: the sky must blend continuously.
  return <svg className={`ewm-wave ${className}`} aria-hidden="true" viewBox="0 0 1440 140" preserveAspectRatio="none">
    <path d="M-20 71C147 13 314 118 480 69 662 16 744 20 902 63 1078 112 1176 6 1350 37c57 10 83 18 110 8" stroke="rgba(239,250,255,.72)" strokeWidth="2.6" fill="none"/>
    <path d="M-20 85C148 25 324 138 486 86 662 30 753 40 908 78c175 43 273-55 437-28 54 9 85 18 115 11" stroke="rgba(141,205,252,.34)" strokeWidth="1.8" fill="none"/>
  </svg>;
}

function Header({ loggedIn, onStart, onLogin, onRegister }) {
  const [open, setOpen] = useState(false);
  const links = [["בית", "#home-top"], ["למי זה מתאים", "#audiences"], ["איך זה עובד", "#journey"], ["עלינו", "#about"], ["המלצות", "#reviews"]];
  return <header className="ewm-header">
    <div className="ewm-container ewm-nav">
      <a className="ewm-brand" href="#home-top" aria-label="EnglishWise — דף הבית" onClick={() => setOpen(false)}><Icon name="book" size={30}/><span lang="en" dir="ltr">EnglishWise</span></a>
      <nav className="ewm-nav-links" aria-label="ניווט בדף הבית">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="ewm-nav-actions"><button type="button" className="ewm-login" onClick={loggedIn ? onStart : onLogin} aria-label={loggedIn ? "אזור אישי" : "התחברות"}>{loggedIn ? "אזור אישי" : "כניסה"}</button>{!loggedIn && <button type="button" className="ewm-btn ewm-btn--small" onClick={onRegister}>התחילו עכשיו <Icon name="arrow" size={16}/></button>}</div>
      <button className="ewm-mobile-menu" type="button" aria-expanded={open} aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"} onClick={() => setOpen(value => !value)}><Icon name={open ? "close" : "menu"}/></button>
    </div>
    {open && <nav className="ewm-mobile-links" aria-label="ניווט לנייד">{links.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}<button type="button" onClick={() => {setOpen(false); loggedIn ? onStart() : onLogin();}}>{loggedIn ? "אזור אישי" : "כניסה"}</button>{!loggedIn && <button type="button" onClick={() => {setOpen(false); onRegister();}}>התחילו עכשיו</button>}</nav>}
  </header>;
}

function Hero({ loggedIn, onStart }) {
  return <section id="home-top" className="ewm-hero">
    <div className="ewm-hero-glow" aria-hidden="true"/>
    <div className="ewm-container ewm-hero-inner">
      <div className="ewm-hero-copy" data-reveal><p className="ewm-kicker">✦ ללמוד בדרך שלך</p>
        <h1>לומדים אנגלית <span>בדרך ברורה ומעוררת השראה.</span></h1>
        <p className="ewm-lead">ב־EnglishWise תמצאו מסלול לימוד מתקדם, אישי ומהנה שיעניק לכם ביטחון אמיתי באנגלית — לחיים, לעבודה ולחלומות שלכם.</p>
        <div className="ewm-hero-actions"><button className="ewm-btn" type="button" onClick={onStart}>{loggedIn ? "ממשיכים ללמוד" : "התחילו עכשיו"}<Icon name="arrow" size={18}/></button><a className="ewm-subtle-link" href="#journey">גלו איך זה עובד <span aria-hidden="true">←</span></a></div>
      </div>
      <img className="ewm-hero-scene" src={heroBalcony} alt="שולחן לימוד לצד נוף הרים ושמיים" fetchPriority="high"/>
      <span className="ewm-sky-balloon ewm-sky-balloon--one" aria-hidden="true"/><span className="ewm-sky-balloon ewm-sky-balloon--two" aria-hidden="true"/>
    </div>
    <Wave className="ewm-wave--hero" fill="#145a93"/>
  </section>;
}

function Audience() {
  return <section id="audiences" className="ewm-audiences">
    <img className="ewm-scenery ewm-scenery--aud-left" src={audienceFlowersLeft} alt="" loading="lazy" aria-hidden="true"/>
    <img className="ewm-scenery ewm-scenery--aud-right" src={audienceFlowersRight} alt="" loading="lazy" aria-hidden="true"/>
    <img className="ewm-scenery ewm-scenery--aud-clouds" src={sceneryClouds} alt="" loading="lazy" aria-hidden="true"/>
    <div className="ewm-container ewm-audience-content">
    <div className="ewm-heading" data-reveal><p className="ewm-kicker ewm-kicker--coral">♥ למי EnglishWise מתאים?</p><h2>אנגלית פותחת דלתות חדשות בשבילכם</h2><p>בין אם אתם בתחילת הדרך או רוצים לשדרג את היכולות שלכם — תמצאו כאן את המסלול המתאים.</p></div>
    <div className="ewm-aud-grid">{audiences.map((item, index) => <article className="ewm-audience" data-reveal key={item.title} style={{"--delay": `${index * 75}ms`}}><span className="ewm-audience-icon"><Icon name={item.icon} size={32}/></span><h3>{item.title}</h3><p>{item.copy}</p><a href="#journey" className="ewm-aud-link" aria-label={`${item.title} — לגלות את המסלול`}><Icon name="arrow" size={17}/></a></article>)}</div>
    <img className="ewm-flowers ewm-flowers--aud" src={flowers} alt="" loading="lazy"/>
  </div><Wave className="ewm-wave--aud" fill="#063e72"/></section>;
}

function Journey() {
  const [active, setActive] = useState(null);
  return <section id="journey" className="ewm-journey">
    <img className="ewm-scenery ewm-scenery--journey-left" src={journeyFlowersLeft} alt="" loading="lazy" aria-hidden="true"/>
    <img className="ewm-scenery ewm-scenery--journey-right" src={journeyMountainsRight} alt="" loading="lazy" aria-hidden="true"/>
    <div className="ewm-container ewm-journey-inner">
    <div className="ewm-heading ewm-heading--light" data-reveal><p className="ewm-kicker ewm-kicker--coral">✦ מסע ההתקדמות שלכם</p><h2>כך תגיעו לאנגלית שתמיד רציתם</h2><p>תהליך פשוט, מהנה ואפקטיבי שמוביל אתכם צעד אחר צעד.</p></div>
    <div className="ewm-journey-track" onPointerLeave={() => setActive(null)}>
      <svg className="ewm-journey-curve" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true"><path className="ewm-curve-base" d="M1080 63C907 0 911 184 721 155S494 38 358 108 205 179 110 50"/><path className="ewm-curve-progress" pathLength="100" d="M1080 63C907 0 911 184 721 155S494 38 358 108 205 179 110 50" style={{strokeDasharray: `${active === null ? 0 : [0, 5, 37, 67, 100][active]} 100`}}/></svg>
      {journey.map((step, index) => <div className={`ewm-stop ewm-stop--${step.number}${active === step.number ? " ewm-stop--active" : ""}`} key={step.number} style={{"--delay": `${index * 90}ms`}}>
        <button type="button" className="ewm-balloon-button" aria-label={`שלב ${step.number}: ${step.title}`} aria-pressed={active === step.number} onMouseEnter={() => setActive(step.number)} onFocus={() => setActive(step.number)} onClick={() => setActive(step.number)}><span className="ewm-balloon-body"><Icon name={step.icon} size={28}/></span><span className="ewm-balloon-basket" aria-hidden="true"/><span className="ewm-step-number">{step.number}</span></button>
        <h3>{step.title}</h3><p>{step.copy}</p>
      </div>)}
    </div>
    <p className="ewm-journey-hint">עברו על הבלונים כדי לגלות את המסלול <span aria-hidden="true">✧</span></p>
  </div><Wave className="ewm-wave--journey" fill="#9dc4e5"/></section>;
}

function About() {
  return <section id="about" className="ewm-about">
    <img className="ewm-scenery ewm-scenery--about-clouds" src={aboutCloudLeft} alt="" loading="lazy" aria-hidden="true"/>
    <div className="ewm-container ewm-about-inner">
    <div className="ewm-about-copy" data-reveal><p className="ewm-kicker ewm-kicker--coral">♥ מה מיוחד ב־EnglishWise?</p><h2>למידה חכמה, רגועה ומותאמת באמת</h2><p className="ewm-about-lead">אנחנו משלבים כלים מתקדמים, גישה אישית וליווי מקצועי כדי להפוך את הלמידה לאפקטיבית, נעימה ומשתלבת בחיים שלכם.</p>
      <div className="ewm-advantages">{advantages.map((item, i) => <div className="ewm-advantage" key={item.title} style={{"--delay": `${i * 90}ms`}}><span><Icon name={item.icon} size={27}/></span><strong>{item.title}</strong><small>{item.copy}</small></div>)}</div>
    </div><span className="ewm-about-script" aria-hidden="true">A Brighter You ♡</span>
  </div><Wave className="ewm-wave--about" fill="#0b477f"/></section>;
}

function BottomCTA({ loggedIn, onStart }) {
  return <section className="ewm-cta"><div className="ewm-container ewm-cta-inner" data-reveal><h2>מוכנים לפתוח לעצמכם אופקים חדשים?</h2><p>הצטרפו לעוד לומדים שמתקדמים באנגלית — ובחיים.</p><button className="ewm-btn" type="button" onClick={onStart}>{loggedIn ? "לאזור הלמידה" : "התחילו עכשיו"}<Icon name="arrow" size={17}/></button></div></section>;
}

export default function Home() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const loggedIn = Boolean(isAuthenticated && user);
  const goToArea = () => { if (user?.role === "teacher") return navigate("/teacher/dashboard"); if (user?.role === "admin") return navigate("/admin/dashboard"); navigate("/dashboard"); };
  const onStart = () => loggedIn ? goToArea() : navigate("/register");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(root.querySelectorAll("[data-reveal]"));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    root.classList.add("ewm-motion-ready");
    targets.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <div className="ewm-home" ref={rootRef} dir="rtl">
    <Header loggedIn={loggedIn} onStart={onStart} onLogin={() => navigate("/login")} onRegister={() => navigate("/register")}/>
    <main><Hero loggedIn={loggedIn} onStart={onStart}/><Audience/><Journey/><About/><ReviewsSection/><BottomCTA loggedIn={loggedIn} onStart={onStart}/></main>
    <footer className="ewm-footer"><div className="ewm-container"><span dir="ltr" lang="en">EnglishWise</span> · ללמוד בדרך שלך <small>© {new Date().getFullYear()}</small></div></footer>
  </div>;
}
