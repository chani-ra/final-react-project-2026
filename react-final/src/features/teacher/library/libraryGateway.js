/** Adapter for the four existing library API contracts. No network logic lives in UI components. */
export function createLibraryGateway(api) {
  const types = {
    lesson: {
      collection: "lessons",
      responseKey: "lesson",
      remove: api.deleteLesson,
      save: api.updateLesson,
      publish: api.updateLessonPublishStatus,
    },
    song: {
      collection: "songs",
      responseKey: "song",
      remove: api.deleteSong,
      save: api.updateSong,
      publish: api.updateSongPublishStatus,
    },
    exercise: {
      collection: "exercises",
      responseKey: "exercise",
      remove: api.deleteExercise,
      save: api.updateExercise,
      publish: (id, isPublic) => api.updateExercise(id, { isPublic }),
    },
    quiz: {
      collection: "quizzes",
      responseKey: "quiz",
      remove: api.deleteQuiz,
      save: api.updateQuiz,
      publish: api.updateQuizPublishStatus,
    },
  };

  const configFor = (type) => {
    if (!Object.hasOwn(types, type)) {
      throw new Error(`סוג תוכן לא נתמך: ${type}`);
    }
    return types[type];
  };

  return {
    async loadAll(teacherId) {
      // The quiz endpoint takes no teacherId in the current service contract.
      const [lessons, songs, exercises, quizzes] = await Promise.all([
        api.getTeacherLessons(teacherId),
        api.getTeacherSongs(teacherId),
        api.getTeacherExercises(teacherId),
        api.getTeacherQuizzes(),
      ]);
      return {
        lessons: lessons || [],
        songs: songs || [],
        exercises: exercises || [],
        quizzes: quizzes || [],
      };
    },

    async remove(type, id) {
      await configFor(type).remove(id);
      return configFor(type).collection;
    },

    async publish(type, id, isPublic) {
      const config = configFor(type);
      const response = await config.publish(id, isPublic);
      return response?.[config.responseKey]?.isPublic ?? isPublic;
    },

    async save(type, id, payload) {
      const config = configFor(type);
      const response = await config.save(id, payload);
      return response?.[config.responseKey] || {};
    },

    collectionFor(type) {
      return configFor(type).collection;
    },
  };
}
