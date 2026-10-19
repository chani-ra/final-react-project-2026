import { courseTabPath } from "../navigation/courseNavigationModel.js";

/** Whitelisted learner audio destinations (never navigate to a track-provided URL). */
export function audioReturnTarget(track) {
  if (!track) return null;
  if (track.returnPath === "/dashboard") {
    return { path: "/dashboard", label: "חזרה לדשבורד" };
  }
  const path = courseTabPath(track.courseId, "songs");
  return path ? { path, label: "חזרה לשירים" } : null;
}
