import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../shared/services/courses/courses.service';
import { Course } from '../../../shared/models/course';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  courseId: number;
  course: Course;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.getCourse(this.courseId);
  }

  getCourse(id: number): void {
    console.log(id);
    this.coursesService.getById(id)
      .subscribe(
        (course: Course) => this.course = course,
        (error: Error) => console.log(error.message)
      );
  }
}

