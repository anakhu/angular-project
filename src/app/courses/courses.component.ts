import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CoursesService } from '../shared/services/courses/courses.service';
import { Course } from '../shared/services/courses/course-model';
import { Subscription } from 'rxjs';
import { AuthService, FireBaseUser } from '../shared/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

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
  @Input() filterValue: {key: string, value: any};

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
      .subscribe((user: FireBaseUser) => this.authUserId = user ? user.uid : null);
  }
}
