import {
  getTeacherLessons,
  getTeacherSongs,
  deleteLesson,
  deleteSong,
  updateLesson,
  updateSong,
  updateLessonPublishStatus,
  updateSongPublishStatus,
} from "../../../services/teacherService";
import {
  getTeacherExercises,
  updateExercise,
  deleteExercise,
} from "../../../services/exerciseService";
import {
  getTeacherQuizzes,
  updateQuiz,
  deleteQuiz,
  updateQuizPublishStatus,
} from "../../../services/quizService";
import { createLibraryGateway } from "./libraryGateway";

export const libraryApi = createLibraryGateway({
  getTeacherLessons,
  getTeacherSongs,
  getTeacherExercises,
  getTeacherQuizzes,
  deleteLesson,
  deleteSong,
  deleteExercise,
  deleteQuiz,
  updateLesson,
  updateSong,
  updateExercise,
  updateQuiz,
  updateLessonPublishStatus,
  updateSongPublishStatus,
  updateQuizPublishStatus,
});
