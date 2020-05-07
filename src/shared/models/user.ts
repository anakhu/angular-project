export interface User {
  id: number;
  name: string;
  country: { name: string, code: string};
  authoredCourses: number[];
  enrolledCourses: number[];
  likedCourses: number[];
  image?: string;
  followers?: number[];
  following?: number[];
}
