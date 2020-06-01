import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../../../app/shared/services/courses/courses.service';
import { Course } from '../../../app/shared/services/courses/course-model';
import { Subscription } from 'rxjs';
import { AuthService, FireBaseUser } from '../../../app/shared/services/auth/auth.service';
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
  filterStr = '';
  filterField = 'name';

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._createAuthSubscription();
    this.activatedRoute.data
      .subscribe((data: {CoursesResolver: Course[]}) => {
        this.courses = data.CoursesResolver;
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }

  private _createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => this.authUserId = user ? user.uid : null);
  }
}
