import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";
import {
  clearAuthStorage,
  getHomePathForRole,
} from "../../services/authSession";
import skyJourneyBackground from "../../assets/sky-journey-background.svg";
import ResponsiveHeader from "./navigation/ResponsiveHeader";
import CourseAudioProvider from "../../features/general/audio/CourseAudioProvider.jsx";
import PersistentCoursePlayer from "../../features/general/audio/PersistentCoursePlayer.jsx";

export default function MainLayout() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    clearAuthStorage();
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  return (
    <CourseAudioProvider>
    <div
      className="relative min-h-screen overflow-x-clip bg-[#55b9ef] text-white"
      dir="rtl"
    >
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${skyJourneyBackground})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-white/0 via-white/0 to-[#0b4f88]/18" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <ResponsiveHeader
          user={user}
          onHome={() => navigate(getHomePathForRole(user.role))}
          onLogout={handleLogout}
        />

        <main className="relative min-w-0 flex-1 px-3 pb-8 pt-4 sm:px-4 md:px-8">
          <div className="mx-auto w-full min-w-0 max-w-7xl">
            <Outlet />
          </div>
        </main>
        <PersistentCoursePlayer />
      </div>
    </div>
    </CourseAudioProvider>
  );
}
