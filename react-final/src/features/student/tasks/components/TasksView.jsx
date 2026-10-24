import SmartGuideBackButton from "../../../../components/ui/SmartGuideBackButton";
import PlanTaskGroup from "./PlanTaskGroup";
import TaskCard from "./TaskCard";
import { EmptyTasks, LoadingState, StatBox, TabButton } from "./taskUi";

export default function TasksView({
  activeTab, setActiveTab, stats, displayItems, progressPercent,
  loading, actionLoadingId,
  handleCompleteTask, handleSubmitForReview, handleDeleteTask,
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-4" dir="rtl">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[1.6rem] border border-white/30 bg-gradient-to-l from-[#255e90]/90 to-[#1e507e]/90 p-4 sm:p-5 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
                מרכז המשימות
              </div>

              <h1
                className="text-2xl font-black leading-tight text-white md:text-3xl"
                style={{
                  textShadow:
                    "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
                }}
              >
                המשימות שלי
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-white/85">
                כל המשימות שלך במקום אחד: לביצוע, בבדיקה והושלמו.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[360px]">
              <StatBox label="לביצוע" value={stats.pending} tone="yellow" />
              <StatBox label="בבדיקה" value={stats.review} tone="blue" />
              <StatBox label="הושלמו" value={stats.completed} tone="green" />
              <StatBox label="XP זמין" value={stats.availableXP} tone="red" />
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm font-black text-white/66">
              <span>התקדמות כללית במשימות</span>
              <span className="text-yellow-100">{progressPercent}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.45)] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>


      <section
        className="relative overflow-hidden rounded-[1.6rem] border border-white/25 bg-[#205484]/72 p-3 sm:p-4 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <TabButton
              label="לביצוע"
              count={stats.pending}
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            />

            <TabButton
              label="בבדיקה"
              count={stats.review}
              active={activeTab === "review"}
              onClick={() => setActiveTab("review")}
            />

            <TabButton
              label="הושלמו"
              count={stats.completed}
              active={activeTab === "completed"}
              onClick={() => setActiveTab("completed")}
            />
          </div>

          {loading ? (
            <LoadingState />
          ) : displayItems.length === 0 ? (
            <EmptyTasks activeTab={activeTab} />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {displayItems.map((item) => {
                if (item.kind === "plan") {
                  return (
                    <PlanTaskGroup
                      key={item.key}
                      title={item.title}
                      tasks={item.tasks}
                      actionLoadingId={actionLoadingId}
                      onComplete={handleCompleteTask}
                      onDelete={handleDeleteTask}
                    />
                  );
                }

                const task = item.task;

                return (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isLoading={actionLoadingId === task._id}
                    onComplete={() =>
                      handleCompleteTask(task._id)
                    }
                    onSubmitForReview={() =>
                      handleSubmitForReview(task._id)
                    }
                    onDelete={() =>
                      handleDeleteTask(task._id)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
