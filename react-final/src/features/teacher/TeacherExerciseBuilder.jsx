import TeacherExerciseBuilderView from "./components/TeacherExerciseBuilderView.jsx";
import { useTeacherExerciseBuilder } from "./hooks/useTeacherExerciseBuilder.js";

export default function TeacherExerciseBuilder() {
  const builder = useTeacherExerciseBuilder();
  return <TeacherExerciseBuilderView {...builder} />;
}
