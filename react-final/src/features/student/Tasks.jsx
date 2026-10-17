import { useTasks } from "./tasks/useTasks";
import TasksView from "./tasks/components/TasksView";

/** Page entry: data behavior lives in useTasks; markup lives in TasksView. */
export default function Tasks() {
  const tasksState = useTasks();
  return <TasksView {...tasksState} />;
}
