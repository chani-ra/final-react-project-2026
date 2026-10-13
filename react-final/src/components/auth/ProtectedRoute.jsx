import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { retrySessionCheck } from "../../redux/slices/authSlice";
import { getHomePathForRole } from "../../services/authSession";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  if (status === "checking") return null;

  if (status === "error") {
    return (
      <div
        role="alert"
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#55b9ef] p-6 text-center text-white"
      >
        <p>לא הצלחנו לבדוק את ההתחברות. בדקי את החיבור לשרת ונסי שוב.</p>
        <button
          type="button"
          onClick={() => dispatch(retrySessionCheck())}
          className="rounded-xl bg-[#072842] px-5 py-3 font-bold"
        >
          נסי שוב
        </button>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return <Outlet />;
}
