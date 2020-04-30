import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { Course } from '../../shared/models/course';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/shared/models/user';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  courses: Course[] = [];
  coursesSubscription: Subscription;
  authSubscription: Subscription;
  authUserStatus: boolean;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.createCourseSyubscription();
    this.createAuthSubscription();
  }

  ngOnDestroy(): void {
    this.coursesSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  private createCourseSyubscription(): void {
    this.coursesSubscription = this.coursesService.createSubscription()
      .subscribe((courses: Course []) => this.courses = courses);
  }

  private createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((authStatus: boolean) => this.authUserStatus = authStatus);
  }
}
