import { useContext } from "react";
import { CourseAudioContext } from "./courseAudioContext.js";

export function useCourseAudio() {
  const context = useContext(CourseAudioContext);
  if (!context) throw new Error("CourseAudioProvider is required for audio controls");
  return context;
}
