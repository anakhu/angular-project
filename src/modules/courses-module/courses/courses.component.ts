import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../../../app/shared/services/courses/course-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  routeSubscription: Subscription;

  filterStr = '';
  filterField = 'name';

  sortRef = 'courses-sort';
  field = '';
  order = '';
  sortLoaded = false;

  page = 1;
  maxItemsPerPage = 6;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagination: PaginationService
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

    if (this.sortLoaded) {
      this.page = 1;
      this.pageChanged(1);
    }
    this.sortLoaded = true;
  }

  public pageChanged(data: number) {
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
