import { Component, OnInit, OnDestroy } from '@angular/core';
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
  authUserId: string;

  routeSubscription: Subscription;
  authSubscription: Subscription;

  filterStr = '';
  filterField = 'name';

  sortRef = 'courses-sort';
  field = '';
  order = '';

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._createAuthSubscription();
    this._createRouteSubscription();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }

  public onSortValChange(data: any) {
    this.field = data.field;
    this.order = data.order;
  }

  private _createRouteSubscription(): void {
    this.routeSubscription = this.activatedRoute.data
      .subscribe((data: {CoursesResolver: Course[]}) => {
        this.courses = data.CoursesResolver;
    });
  }

  private _createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => this.authUserId = user ? user.uid : null);
  }
}
