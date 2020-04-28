export interface Course {
  id?: number;
  name: string;
  content: string;
  author: string;
  image?: string;
  startDate: string;
  endDate: string;
  price?: number;
  sessions: number;
  studentsMax: number;
  certificate: boolean;
}

export interface CourseFormData {
  name?: string;
  content?: string;
  author?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  sessions?: number;
  studentsMax?: number;
  certificate?: boolean;
}
