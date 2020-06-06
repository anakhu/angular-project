import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../app/shared/models/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SortOptions } from 'src/app/shared/models/sortOptions';
import { PaginationService } from 'src/app/shared/services/pagination/pagination.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  routeSubscription: Subscription;

  filterStr = '';
  filterField = 'name';

  field = '';
  order = 'ASC';
  sortRef = 'users-sort';
  sortLoaded = false;

  page = 1;
  maxItemsPerPage = 8;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagination: PaginationService
  ) {}

  ngOnInit(): void {
    this._createRouteSubscription();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }

  public onSortValChange(data: SortOptions) {
    this.field = data.field;
    this.order = data.order;
    if (this.sortLoaded) {
      this.page = 1;
      this.pageChanged(1);
    }
    this.sortLoaded = true;
  }

  public pageChanged(data: number) {
    this.pagination.saveCurrentPage('users-page', data);
  }

  private _createRouteSubscription(): void {
    this.routeSubscription = this.activatedRoute.data
      .subscribe((data: {UsersResolver: User[]}) => {
        this.users = data.UsersResolver;
        this._getActivePage();
      });
  }

  private _getActivePage() {
    this.page = this.pagination.getPage('users-page', this.users.length, this.maxItemsPerPage);
  }
}
