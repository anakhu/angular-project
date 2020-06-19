import { SortOptions } from 'src/app/shared/models/sortOptions';

export const USER_SORT_OPTIONS: SortOptions[] = [
  {
    field: 'name',
    alias: 'name',
    order: 'ASC',
    tooltip: {
      ASC: 'Users by name from Z to A',
      DESC: 'Users by name from A to Z'
    }
  },
  {
    field: 'authoredCourses',
    alias: 'courses authored',
    order: 'ASC',
    tooltip: {
      ASC: 'Users who authored less courses go first',
      DESC: 'Users who authored more courses go first'
    },
  },
];


export const COURSE_SORT_OPTIONS: SortOptions[] = [
  {
    field: 'likes',
    alias: 'likes',
    order: 'ASC',
    tooltip: {
      ASC: 'Courses with who less likes go first',
      DESC: 'Courses with who more likes go first'
    }
  },
  {
    field: 'price',
    alias: 'price',
    order: 'ASC',
    tooltip: {
      ASC: 'Cheap courses go first',
      DESC: 'Expensive courses go first'
    }
  },
  {
    field: 'students',
    alias: 'popularity',
    order: 'ASC',
    tooltip: {
      ASC: 'Courses with less students go first',
      DESC: 'Courses with more students go first'
    }
  },
  {
    field: 'startDate',
    alias: 'start date',
    order: 'ASC',
    tooltip: {
      ASC: 'Courses that start sooner go first',
      DESC: 'Courses that start later go first'
    }
  },
];

export const sortOptMap = {
  'users-sort': USER_SORT_OPTIONS,
  'courses-sort': COURSE_SORT_OPTIONS,
};
