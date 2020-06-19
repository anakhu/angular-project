export interface CourseFormData {
  name: string;
  content: string;
  startDate: string;
  endDate: string;
  price: number;
  certificate: boolean;
  image: {
    files: File[],
  };
}
