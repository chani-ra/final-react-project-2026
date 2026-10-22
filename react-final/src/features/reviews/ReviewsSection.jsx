import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddReviewModal from "./AddReviewModal";
import AppFeedbackModal from "../../components/ui/AppFeedbackModal";
import { getApprovedReviews } from "../../services/reviewService";
import reviewBlossoms from "../../assets/home-motion/reviews-blossom.webp";
import reviewMountains from "../../assets/home-motion/reviews-balloon.webp";

const examples = [
  { _id: "demo-a", usernameSnapshot: "משתמשת לדוגמה", roleSnapshot: "student", rating: 5, text: "הדרך ללימוד כאן פשוט נעימה. התוכן ממוקד וליווי אישי נותן מוטיבציה להמשיך." },
  { _id: "demo-b", usernameSnapshot: "משתמש לדוגמה", roleSnapshot: "student", rating: 5, text: "בזכות EnglishWise הצלחתי להתכונן לראיון עבודה באנגלית ולהרגיש הרבה יותר ביטחון." },
  { _id: "demo-c", usernameSnapshot: "משתמשת לדוגמה", roleSnapshot: "teacher", rating: 5, text: "השיעורים ברורים וממוקדים. הרגשתי שאני מתקדמת כבר אחרי כמה שבועות." },
  { _id: "demo-d", usernameSnapshot: "משתמשת לדוגמה", roleSnapshot: "student", rating: 5, text: "כל כלי הלימוד במקום אחד, והכול מסודר בצורה נעימה שמזמינה להמשיך." },
];
const roleNames = { student: "לומדת", teacher: "מורה", admin: "צוות האתר" };

function ReviewTile({ review, demo }) {
  const [expanded, setExpanded] = useState(false);
  const name = review.usernameSnapshot || review.user?.username || "משתמשת";
  const role = roleNames[review.roleSnapshot || review.user?.role] || "לומדת";
  const message = typeof review.text === "string" ? review.text : "";
  const rating = Math.min(5, Math.max(1, Math.round(Number(review.rating) || 5)));
  return <article className="ewf-review-card"><span className="ewf-review-quote" aria-hidden="true">“</span>
    <p className={`ewf-review-text${expanded ? " ewf-review-text--open" : ""}`}>{message}</p>
    {message.length > 170 && <button className="ewf-review-more" type="button" onClick={() => setExpanded(s => !s)}>{expanded ? "הצג פחות" : "קרא עוד"}</button>}
    <div className="ewf-review-bottom"><span className="ewf-review-avatar" aria-hidden="true">{demo ? "✦" : name.slice(0, 1)}</span><div className="ewf-review-by"><strong>{name}</strong><small>{demo ? "להמחשה בלבד" : role}</small></div><span className="ewf-review-rating" aria-label={`דירוג ${rating} מתוך 5`}><span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5-rating)}</span></span></div>
  </article>;
}

export default function ReviewsSection() {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, type: "success", title: "", message: "" });
  const isLoggedIn = Boolean(isAuthenticated && user);

  const loadReviews = async () => {
    try { setLoading(true); const list = await getApprovedReviews(); setReviews(Array.isArray(list) ? list : []); setStart(0); }
    catch { setReviews([]); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    let mounted = true;
    getApprovedReviews()
      .then(list => { if (mounted) setReviews(Array.isArray(list) ? list : []); })
      .catch(() => { if (mounted) setReviews([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  const demo = !loading && reviews.length === 0;
  const items = demo ? examples : reviews;
  const visible = Array.from({length: Math.min(3,items.length)}, (_, i) => items[(start+i)%items.length]);
  const move = delta => setStart(n => (n + delta + items.length) % items.length);
  const add = () => isLoggedIn ? setAddOpen(true) : setFeedback({ isOpen:true, type:"warning", title:"כדי להוסיף המלצה צריך להתחבר", message:"אחרי התחברות ניתן לכתוב המלצה קצרה על האתר." });
  const closeFeedback = () => setFeedback(s=>({...s,isOpen:false}));
  const created = () => { setFeedback({isOpen:true,type:"success",title:"תודה רבה!",message:"ההמלצה נשלחה לבדיקה."}); loadReviews(); };

  return <section id="reviews" className="ewf-reviews" aria-labelledby="ewf-reviews-title">
    <img className="ewm-scenery ewm-scenery--reviews-left" src={reviewBlossoms} alt="" loading="lazy" aria-hidden="true"/>
    <img className="ewm-scenery ewm-scenery--reviews-right" src={reviewMountains} alt="" loading="lazy" aria-hidden="true"/>
    <div className="ewf-container ewf-reviews-layout"><div className="ewf-reviews-header"><p className="ewf-eyebrow">♥ מה אומרים הלומדים שלנו?</p><h2 id="ewf-reviews-title">סיפורי הצלחה והתקדמות</h2><p>חוויות קטנות בדרך להצלחה גדולה.</p>{demo && <p className="ewf-demo-notice">ההמלצות המוצגות הן דוגמאות לעיצוב בלבד, ולא עדויות של משתמשים אמיתיים.</p>}</div>
  {loading ? <p role="status" style={{textAlign:"center",padding:24}}>טוענים המלצות...</p> : <><div className="ewf-reviews-carousel"><button className="ewf-review-nav" type="button" onClick={()=>move(-1)} disabled={items.length<2} aria-label="המלצות קודמות">❯</button><div className="ewf-reviews-grid">{visible.map((item,index)=><ReviewTile key={`${item._id || index}-${index}`} review={item} demo={demo}/>)}</div><button className="ewf-review-nav" type="button" onClick={()=>move(1)} disabled={items.length<2} aria-label="המלצות הבאות">❮</button></div><div className="ewf-review-controls">{items.length>3 && Array.from({length:Math.min(items.length,8)},(_,index)=><button type="button" className="ewf-review-dot" key={index} onClick={()=>setStart(index)} aria-current={start===index} aria-label={`הצג המלצות החל מפריט ${index+1}`}/>)}<button className="ewf-add-review" type="button" onClick={add}>✧ הוספת המלצה</button></div></>}
  </div><AddReviewModal isOpen={addOpen} onClose={()=>setAddOpen(false)} onCreated={created}/><AppFeedbackModal isOpen={feedback.isOpen} type={feedback.type} title={feedback.title} message={feedback.message} primaryText={feedback.type === "warning" ? "להתחברות" : "סגור"} secondaryText={feedback.type === "warning" ? "לא עכשיו" : ""} onPrimary={()=>{closeFeedback();if(feedback.type === "warning") navigate("/login");}} onSecondary={closeFeedback} onClose={closeFeedback}/></section>;
}
