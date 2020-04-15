import { Component, OnInit } from '@angular/core';
import { USERS } from '../../shared/services/mock';
import { User } from '../../shared/models/user';
import { Course } from '../../shared/models/course';
import { CoursesService } from '../../shared/services/courses.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  likedCourses: Course[] = [];
  enrolledCourses: Course[] = [];
  authoredCourses: Course[] = [];
  addForm = false;

  constructor(
    private coursesService: CoursesService,
  ) { }

  ngOnInit(): void {
    this.user = USERS[0];
    this.getUserCourses(this.user.authoredCourses, this.authoredCourses);
    this.getUserCourses(this.user.likedCourses, this.likedCourses);
    this.getUserCourses(this.user.enrolledCourses, this.enrolledCourses);
    console.log(this.authoredCourses);
    console.log(this.enrolledCourses);
  }

  // rewrite and add error handler
  getUserCourses(ids: number[], targetArray: Course[]): void {
    ids.forEach((id) => {
      this.coursesService.getById(id)
        .subscribe((x: Course) => targetArray.push(x));
    });
  }

  onAddBtnClick() {
    this.addForm = !this.addForm;
  }

  addItem(course: Course) {
    this.authoredCourses.push(course);
  }

}
