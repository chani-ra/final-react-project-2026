/**
 * Frontend data contracts for the populated course response.
 * Based on the Node/Mongoose Course schema and GET /courses/:courseId.
 * These types are compile-time checks, NOT validation of server responses.
 */
export type CourseTab = "lessons" | "songs" | "exercises" | "quizzes";

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseCategory =
  | "grammar"
  | "vocabulary"
  | "conversation"
  | "reading"
  | "listening"
  | "general";

export interface CourseContentItem {
  _id: string;
  title?: string;
  description?: string;
  theme?: string;
  level?: CourseLevel;
}

/** The full Course document includes additional fields; only accessed fields are modeled here. */
export interface Course {
  _id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  description?: string;
  lessons?: CourseContentItem[] | null;
  songs?: CourseContentItem[] | null;
  exercises?: CourseContentItem[] | null;
  quizzes?: CourseContentItem[] | null;
}

export interface CourseByIdResponse {
  success: boolean;
  course: Course;
}

export interface CourseProgress {
  completedLessons?: string[];
  completedSongs?: string[];
  completedExercises?: string[];
  completedQuizzes?: string[];
}

/** Restrict callers to the course's content fields without requiring unrelated metadata. */
export type CourseContentSource = Partial<Pick<Course, CourseTab>>;

const EMPTY_ITEMS: readonly CourseContentItem[] = Object.freeze([]);

/**
 * Keep the existing behavior for missing content or unsupported tabs.
 * Centralizing this in a typed module prevents mistyping content fields later.
 */
export function selectCourseItems(
  course: CourseContentSource | null | undefined,
  tab: string,
): readonly CourseContentItem[] {
  switch (tab) {
    case "lessons":
      return course?.lessons ?? EMPTY_ITEMS;
    case "songs":
      return course?.songs ?? EMPTY_ITEMS;
    case "exercises":
      return course?.exercises ?? EMPTY_ITEMS;
    case "quizzes":
      return course?.quizzes ?? EMPTY_ITEMS;
    default:
      return EMPTY_ITEMS;
  }
}

/** GET /courses/enrolled */
export interface EnrolledCoursesResponse {
  success: boolean;
  courses: Course[];
  total: number;
  pages: number;
  currentPage: number;
}

/** GET /courses/recommended */
export interface RecommendedCoursesResponse {
  success: boolean;
  courses: Course[];
  count: number;
}

/** POST /courses/:courseId/enroll */
export interface EnrollCourseResponse {
  success: boolean;
  message: string;
  courseId: string;
  progressPercent: number;
}

export type CourseHobby = "art_music" | "sports" | "movies" | "books";
export type CourseExpectation =
  | "grammar"
  | "fluent_speaking"
  | "confidence"
  | "vocabulary";

/** Request body for POST /courses/create-personalized */
export interface CreatePersonalizedCourseRequest {
  englishLevel: CourseLevel;
  favoriteHobbies: CourseHobby[];
  expectations: CourseExpectation[];
  customTitle: string;
}

export interface ContentSelectionCounts {
  lessons: number;
  songs: number;
  exercises: number;
  quizzes: number;
}

/** Returned by create/refresh personalized course endpoints. */
export interface PersonalizedCourseResponse {
  success: boolean;
  message: string;
  course: Course;
  selected: ContentSelectionCounts;
  aiReason?: string;
}
