import { isAxiosError, type AxiosInstance } from "axios";
import axiosConfig from "./axiosConfig";
import type {
  CourseByIdResponse,
  CreatePersonalizedCourseRequest,
  EnrollCourseResponse,
  EnrolledCoursesResponse,
  PersonalizedCourseResponse,
  RecommendedCoursesResponse,
} from "../contracts/courseContracts";

// The shared Axios instance owns authentication, token refresh and baseURL.
// Typing this reference does not create another client or change its interceptors.
const client: AxiosInstance = axiosConfig;

// Keep the existing Hebrew error messages; TypeScript requires narrowing
// the unknown value caught in a catch block before reading response.data.
function errorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

// GET /courses/enrolled
export async function getMyCourses(): Promise<EnrolledCoursesResponse> {
  try {
    const response = await client.get<EnrolledCoursesResponse>("/courses/enrolled");
    return response.data;
  } catch (error) {
    throw errorMessage(error, "נכשל בטעינת הקורסים שלי");
  }
}

// GET /courses/recommended
export async function getRecommendedCourses(): Promise<RecommendedCoursesResponse> {
  try {
    const response = await client.get<RecommendedCoursesResponse>("/courses/recommended");
    return response.data;
  } catch (error) {
    throw errorMessage(error, "נכשל בטעינת קורסים מומלצים");
  }
}

// POST /courses/:courseId/enroll
export async function enrollInCourse(courseId: string): Promise<EnrollCourseResponse> {
  try {
    const response = await client.post<EnrollCourseResponse>(`/courses/${courseId}/enroll`);
    return response.data;
  } catch (error) {
    throw errorMessage(error, "נכשל בהרשמה לקורס");
  }
}

// GET /courses/:courseId
export async function getCourseById(courseId: string): Promise<CourseByIdResponse> {
  try {
    const response = await client.get<CourseByIdResponse>(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw errorMessage(error, "נכשל בטעינת הקורס");
  }
}

// POST /courses/:courseId/refresh-personalized
export async function refreshPersonalizedCourse(
  courseId: string,
): Promise<PersonalizedCourseResponse> {
  try {
    const response = await client.post<PersonalizedCourseResponse>(
      `/courses/${courseId}/refresh-personalized`,
    );
    return response.data;
  } catch (error) {
    throw errorMessage(error, "נכשל ברענון המסלול האישי");
  }
}

// POST /courses/create-personalized
export async function createPersonalizedCourse(
  coursePreferences: CreatePersonalizedCourseRequest,
): Promise<PersonalizedCourseResponse> {
  try {
    const response = await client.post<PersonalizedCourseResponse>(
      "/courses/create-personalized",
      coursePreferences,
    );
    return response.data;
  } catch (error) {
    throw errorMessage(error, "נכשל ביצירת קורס אישי נוסף");
  }
}
