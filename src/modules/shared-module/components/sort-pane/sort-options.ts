import { SortOptions } from 'src/app/shared/models/sortOptions';

export const USER_SORT_OPTIONS: SortOptions[] = [
  {
    field: 'name',
    alias: 'name',
    order: 'ASC'
  },
  {
    field: 'authoredCourses',
    alias: 'courses authored',
    order: 'ASC'
  },
];


export const COURSE_SORT_OPTIONS: SortOptions[] = [
  {
    field: 'likes',
    alias: 'likes',
    order: 'ASC',
  },
  {
    field: 'price',
    alias: 'price',
    order: 'ASC',
  },
  {
    field: 'students',
    alias: 'popularity',
    order: 'ASC'
  },
];

export const sortOptMap = {
  'users-sort': USER_SORT_OPTIONS,
  'courses-sort': COURSE_SORT_OPTIONS,
};
