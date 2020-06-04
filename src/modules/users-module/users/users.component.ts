import { Component, OnInit, OnDestroy, AfterViewChecked, OnChanges, AfterContentChecked, AfterViewInit } from '@angular/core';
import { User } from '../../../app/shared/models/user';
import { UsersService } from '../../../app/shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SortOptions } from 'src/app/shared/models/sortOptions';
import { StorageService } from 'src/app/shared/services/storage.service';
import { tap, delay, takeUntil } from 'rxjs/operators';

const SORT_OPTIONS: SortOptions[] = [
  {
    field: 'name',
    alias: 'name',
    order: 'ASC'
  },
  {
    field: 'authoredCourses',
    alias: 'courses authored',
    order: 'ASC'
  },
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoaded: boolean;
  usersSubscription: Subscription;
  routeSubscription: Subscription;

  filterStr = '';
  filterField = 'name';

  sortOptions: SortOptions[];
  field = '';
  order = 'ASC';
  sortRef = 'users-sort';

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._createRouteSubscription();
    this._createUserSubscription();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }

  public onSortValChange(data: SortOptions) {
    this.field = data.field;
    this.order = data.order;
  }

  private _createRouteSubscription(): void {
    this.routeSubscription = this.activatedRoute.data
      .subscribe((data: {UsersResolver: User[]}) => this.users = data.UsersResolver);
  }

  private _createUserSubscription(): void {
    this.usersSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }
}
