import { useCallback, useEffect, useState } from "react";
import { getTeacherStudents } from "../../../services/teacherService";
import { useNotices } from "../../../components/ui/NoticeProvider";
import { normalizeTeacherStudents } from "./teacherStudentsModel.js";

export default function useTeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const notices = useNotices();

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStudents(normalizeTeacherStudents(await getTeacherStudents()));
    } catch (err) {
      const message = typeof err === "string" ? err : err?.response?.data?.message || err?.message || "לא ניתן לטעון תלמידים";
      setError(message);
      notices.error(message, "טעינת תלמידים נכשלה");
    } finally {
      setLoading(false);
    }
  }, [notices]);

  useEffect(() => { reload(); }, [reload]);
  return { students, loading, error, reload };
}
