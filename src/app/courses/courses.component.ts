import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { Course } from '../../shared/models/course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];

  selectedCourse: Course;

  constructor(
    private coursesService: CoursesService,
  ) { }

  ngOnInit(): void {
    this.courses = this.coursesService.getCourses();
  }

  onClick(id: number) {
    this.selectedCourse = this.courses
      .find((course: Course) => course.id === id);
  }

}
