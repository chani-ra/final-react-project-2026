import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../services/authService";
import { clearAuthStorage, getSessionVersion, normalizeUser } from "../../services/authSession";
import { logoutUser, restoreSession, sessionCheckFailed } from "../../redux/slices/authSlice";

export default function SessionBootstrap() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (status !== "checking") return;

    let active = true;
    const version = getSessionVersion();

    getCurrentUser()
      .then((rawUser) => {
        if (!active || version !== getSessionVersion()) return;
        const user = normalizeUser(rawUser);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(restoreSession(user));
      })
      .catch((error) => {
        if (!active || version !== getSessionVersion()) return;

        const statusCode = error.response?.status;
        if ([401, 403, 404].includes(statusCode)) {
          clearAuthStorage();
          dispatch(logoutUser());
        } else {
          dispatch(sessionCheckFailed());
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch, status]);

  return null;
}
