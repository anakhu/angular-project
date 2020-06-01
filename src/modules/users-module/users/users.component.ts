import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../app/shared/models/user';
import { UsersService } from '../../../app/shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filterStr = '';
  filterField = 'name';
  usersSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._createRouteSubscription();
    this._createUserSubscription();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  private _createRouteSubscription(): void {
    this.routeSubscription = this.activatedRoute.data
      .subscribe((data: {UsersResolver: User[]}) => {
        this.users = data.UsersResolver;
      });
  }

  private _createUserSubscription(): void {
    this.usersSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => this.users = users);
  }

  public onFilterValChange(value: string) {
    this.filterStr = value;
  }
}
