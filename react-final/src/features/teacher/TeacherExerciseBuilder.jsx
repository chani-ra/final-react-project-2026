import TeacherExerciseBuilderView from "./exerciseBuilder/TeacherExerciseBuilderView.jsx";
import { useTeacherExerciseBuilder } from "./exerciseBuilder/useTeacherExerciseBuilder.js";

export default function TeacherExerciseBuilder() {
  const builder = useTeacherExerciseBuilder();
  return <TeacherExerciseBuilderView {...builder} />;
}
