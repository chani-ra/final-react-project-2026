import { useLocation, useNavigate } from "react-router-dom";
import { resolveCourseReturn } from "./courseNavigationModel.js";

export default function useCourseReturn(fallbackTab, { teacherPreview = false } = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = resolveCourseReturn(location, fallbackTab);
  return {
    returnLabel: destination.path ? destination.label : teacherPreview ? "חזרה" : "חזרה לקורסים",
    goBack: () => {
      if (destination.path) navigate(destination.path);
      else if (teacherPreview) navigate(-1);
      else navigate("/courses");
    },
  };
}
