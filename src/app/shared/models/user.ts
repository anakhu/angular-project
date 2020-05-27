export interface User {
  id: string;
  name: string;
  country: { name: string, code: string};
  occupation: string;
  isActive?: boolean;
  image?: string;
  authoredCourses?: string[];
  enrolledCourses?: string[];
  likedCourses?: string[];
  followers?: string[];
  following?: string[];
}
