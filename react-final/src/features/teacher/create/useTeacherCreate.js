import { useState } from "react";
import useMessageNotice from "../../../components/ui/useMessageNotice.js";
import { createLesson, uploadSong } from "../../../services/teacherService.js";
import { buildTeacherCreatePayload, validateTeacherCreate } from "./teacherCreateModel.js";

export default function useTeacherCreate() {
  const [contentType, setContentType] = useState("video");
  const [isDragging, setIsDragging] = useState(false);
  const [publishMode, setPublishMode] = useState("draft");

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("general");
  const [level, setLevel] = useState("beginner");
  const [minAge, setMinAge] = useState(6);
  const [maxAge, setMaxAge] = useState(18);
  const [hobbies, setHobbies] = useState([]);
  const [expectations, setExpectations] = useState([]);

  const [duration, setDuration] = useState("180");
  const [composer, setComposer] = useState("לא ידוע");
  const [lyricist, setLyricist] = useState("לא ידוע");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  const updateSmartField = (field, value) => {
    if (field === "category") setCategory(value);
    if (field === "level") setLevel(value);
    if (field === "targetAgeMin") setMinAge(value);
    if (field === "targetAgeMax") setMaxAge(value);
  };

  const toggleArrayValue = (field, value) => {
    if (field === "hobbies") {
      setHobbies((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }

    if (field === "expectations") {
      setExpectations((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const handleContentTypeChange = (nextType) => {
    setContentType(nextType);
    setFile(null);
    setFileName("");
    setMessage({ type: "", text: "" });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
      setFileName(event.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const resetForm = () => {
    setTitle("");
    setTopic("");
    setDescription("");
    setFile(null);
    setFileName("");
    setCategory("general");
    setLevel("beginner");
    setMinAge(6);
    setMaxAge(18);
    setHobbies([]);
    setExpectations([]);
    setDuration("180");
    setComposer("לא ידוע");
    setLyricist("לא ידוע");
    setPublishMode("draft");
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    const validationError = validateTeacherCreate({ title, topic, file, minAge, maxAge, contentType, duration, composer, lyricist });

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const formData = buildTeacherCreatePayload({ title, topic, description, contentType, category, level, minAge, maxAge, hobbies, expectations, publishMode, file, duration, composer, lyricist });

    try {
      if (contentType === "video") {
        await createLesson(formData);
      } else {
        await uploadSong(formData);
      }

      setMessage({
        type: "success",
        text:
          publishMode === "published"
            ? contentType === "video"
              ? "השיעור פורסם בהצלחה."
              : "השיר פורסם בהצלחה."
            : contentType === "video"
            ? "השיעור נשמר כטיוטה."
            : "השיר נשמר כטיוטה.",
      });

      resetForm();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  return { contentType, isDragging, publishMode, fileName, title, topic, description, category, level, minAge, maxAge, hobbies, expectations, duration, composer, lyricist, isLoading, setPublishMode, setTitle, setTopic, setDescription, setDuration, setComposer, setLyricist, updateSmartField, toggleArrayValue, handleContentTypeChange, handleDragOver, handleDragLeave, handleDrop, handleFileChange, handleSubmit };
}
