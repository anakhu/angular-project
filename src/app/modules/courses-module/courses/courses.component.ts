import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Course } from '../../../shared/models/courses/course';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  @ViewChild('container', {static: false}) container: ElementRef;
  courses: Course[] = [];
  courses$: Observable<Course>;
  routeSubscription: Subscription;

  filterStr = '';
  filterField = 'name';

  sortRef = 'courses-sort';
  field = '';
  order = '';
  sortLoaded = false;

  page = 1;
  maxItemsPerPage = 12;

  hideInactive = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagination: PaginationService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this._createRouteSubscription();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }

  public onSortValChange(data: any) {
    this.field = data.field;
    this.order = data.order;
  }

  public onToggleStatusChange(checked: boolean) {
    this.hideInactive = checked;
  }

  public pageChanged(data: number) {
    if (this.container) {
      this.container.nativeElement.offsetParent.scrollTop = 0;
    }
    this.pagination.saveCurrentPage('courses-page', data);
  }

  private _createRouteSubscription(): void {
    this.routeSubscription = this.activatedRoute.data
      .subscribe((data: {CoursesResolver: Course[]}) => {
        this.courses = data.CoursesResolver;
        this._getActivePage();
    });
  }

  private _getActivePage() {
    this.page = this.pagination.getPage('courses-page', this.courses.length, this.maxItemsPerPage);
  }

}
