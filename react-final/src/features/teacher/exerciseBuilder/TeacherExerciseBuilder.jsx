import TeacherExerciseBuilderView from "./TeacherExerciseBuilderView.jsx";
import { useTeacherExerciseBuilder } from "./useTeacherExerciseBuilder.js";

export default function TeacherExerciseBuilder() {
  const builder = useTeacherExerciseBuilder();
  return <TeacherExerciseBuilderView {...builder} />;
}
