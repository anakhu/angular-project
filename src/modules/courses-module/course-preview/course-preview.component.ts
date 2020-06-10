import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/services/courses/course-model';
import { AppService } from 'src/app/shared/services/app/app.service';
import { routes } from 'src/environments/environment';

@Component({
  selector: 'app-course-preview',
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.component.scss']
})
export class CoursePreviewComponent implements OnInit {
  courses: Course[] = [];
  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {
    this._getCurrentCourses();
  }

  private _getCurrentCourses() {
    this.app.getFirebaseReference().ref(`/${routes.courses}/`)
      .orderByChild('likes')
      .limitToLast(6)
      .once('value', data => {
        data.forEach((entry: any) => {
          const course = {
            id: entry.key,
            ...entry.val()
          };
          if (course.isActive) {
            this.courses.push(course);
          }
        });
      });
  }

}
