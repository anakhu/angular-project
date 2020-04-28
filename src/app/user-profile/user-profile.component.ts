import { Component, OnInit } from '@angular/core';
import { USERS } from '../../shared/services/mock';
import { User } from '../../shared/models/user';
import { Course } from '../../shared/models/course';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  authUserId: number;
  authUser: User;
  addForm = false;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authUserId = this.authService.getAuthUser().id;
    this.authUser = this.authService.getAuthUser();
  }

  // addItem(course: Course) {
  //   this.authoredCourses.push(course);
  // }

}
