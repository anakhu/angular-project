import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { Course } from '../../shared/models/course';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];
  selectedCourse: Course;
  observable: Subscription;

  constructor(
    private coursesService: CoursesService,
  ) { }

  ngOnInit(): void {
    this.observable = this.coursesService.createSubscription()
      .subscribe((courses: Course []) => this.courses = courses);
  }

  onClick(id: number) {
    this.selectedCourse = this.courses
      .find((course: Course) => course.id === id);
  }

}
