export interface Course {
  name: string;
  content: string;
  authorId: string;
  startDate: string;
  endDate: string;
  price: number;
  certificate: boolean;
  image?: string;
  isActive?: boolean;
  students?: string[];
  id?: string;
  likes?: number;
}

