export interface User {
  id: string;
  name: string;
  country: { name: string, code: string};
  occupation: string;
  image?: string;
  isActive?: boolean;
  authoredCourses?: string[];
  enrolledCourses?: string[];
  likedCourses?: string[];
  followers?: string[];
  following?: string[];
}
