export interface Course {
  name: string;
  content: string;
  author: string;
  authorId: number;
  startDate: string;
  endDate: string;
  price: number;
  sessions: number;
  studentsMax: number;
  certificate: boolean;
  id?: number;
  likes?: number;
  image?: string;
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
