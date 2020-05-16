import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { Course } from '../../shared/models/course';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { ActivatedRoute, ResolveData } from '@angular/router';
import { LoginUser } from 'src/shared/services/auth/login.user';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  courses: Course[] = [];
  coursesSubscription: Subscription;
  authSubscription: Subscription;
  authUserId: string;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createAuthSubscription();
    this.activatedRoute.data
      .subscribe((data: {CoursesResolver: Course[]}) => {
        this.courses = data.CoursesResolver;
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  private createCourseSyubscription(): void {
    this.coursesSubscription = this.coursesService.createSubscription()
      .subscribe((courses: Course []) => this.courses = courses);
  }

  private createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: LoginUser) => this.authUserId = user ? user.id : null);
  }
}
