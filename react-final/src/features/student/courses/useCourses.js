import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotices } from "../../../components/ui/NoticeProvider";
import { enrollInCourse, getMyCourses, getRecommendedCourses } from "../../../services/courseService";
import { getCourseTotalItems } from "./coursesModel.js";

export default function useCourses() {
  const navigate = useNavigate();
  const notices = useNotices();
  const scrollerRef = useRef(null);

  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("myCourses");

  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [enrollingId, setEnrollingId] = useState("");

  const [error, setError] = useState("");

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyCourses();
      setMyCourses(data.courses || []);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);

      const data = await getRecommendedCourses();
      setRecommendedCourses(data.courses || []);
    } catch (err) {
      notices.error(err.toString());
    } finally {
      setRecommendedLoading(false);
    }
  };

  useEffect(() => {
    loadMyCourses();
  }, []);

  const handleRecommendedTab = async () => {
    setActiveTab("recommended");

    if (recommendedCourses.length === 0) {
      await loadRecommendedCourses();
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);

      await enrollInCourse(courseId);

      notices.success("נרשמת לקורס בהצלחה.", "הרשמה לקורס");

      await loadMyCourses();
      await loadRecommendedCourses();

      setActiveTab("myCourses");
    } catch (err) {
      notices.error(err.toString());
    } finally {
      setEnrollingId("");
    }
  };

  const visibleCourses = useMemo(() => {
    return activeTab === "myCourses" ? myCourses : recommendedCourses;
  }, [activeTab, myCourses, recommendedCourses]);

  const stats = useMemo(() => {
    const allItems = myCourses.reduce((acc, course) => {
      return acc + getCourseTotalItems(course);
    }, 0);

    return {
      totalMyCourses: myCourses.length,
      totalRecommended: recommendedCourses.length,
      allItems,
    };
  }, [myCourses, recommendedCourses]);

  const scrollCourses = (direction) => {
    if (!scrollerRef.current) return;

    scrollerRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return { navigate, scrollerRef, myCourses, recommendedCourses, activeTab, setActiveTab, loading, recommendedLoading, enrollingId, error, handleRecommendedTab, handleEnroll, visibleCourses, stats, scrollCourses };
}
