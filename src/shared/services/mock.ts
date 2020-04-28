import { Course } from '../models/course';
import { User } from '../models/user';

export const COURSES: Course[] = [
  {
    id: 1,
    name: 'Node.js',
    content: 'A basic Node.js course for beginners',
    author: 'Node.js Titan',
    image: './assets/images/download.jpeg',
    startDate: '12/08/2020',
    endDate: '12/11/2020',
    price: 80,
    sessions: 20,
    studentsMax: 20,
    certificate: false,
  },
  {
    id: 2,
    name: 'Drawing for beginners',
    content: 'A basic drawing course for beginners',
    author: 'Mrs Pencifly',
    image: './assets/images/drawing.png',
    startDate: '12/06/2020',
    endDate: '12/08/2020',
    price: 0,
    sessions: 10,
    studentsMax: 20,
    certificate: false,
  },
  {
    id: 3,
    name: 'Advanced Python',
    content: 'An advanced Python course',
    author: 'the Pythonist',
    image: './assets/images/python.jpg',
    startDate: '09/06/2020',
    endDate: '09/10/2020',
    price: 300,
    sessions: 25,
    studentsMax: 12,
    certificate: true,
  },
  {
    id: 4,
    name: 'Spanish for beginners',
    content: 'Comprehensive Spanish Lessons for beginners',
    author: 'Ola HOLa',
    image: './assets/images/spanish.png',
    startDate: '09/06/2020',
    endDate: '09/10/2020',
    price: 70,
    sessions: 30,
    studentsMax: 10,
    certificate: true,
  },
];

export const USERS: User[] = [
  {
    id: 1,
    name: 'Ola HOla',
    authoredCourses: [4],
    enrolledCourses: [2],
    likedCourses: [1, 3],
  },
  {
    id: 2,
    name: 'Node.js Titan',
    authoredCourses: [1],
    enrolledCourses: [],
    likedCourses: [],
  },
  {
    id: 3,
    name: 'the Pythonist',
    authoredCourses: [3],
    enrolledCourses: [2],
    likedCourses: [1, 3],
  },
  {
    id: 4,
    name: 'Mrs Pencifly',
    authoredCourses: [2],
    enrolledCourses: [1],
    likedCourses: [],
  },
];

