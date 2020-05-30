import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FollowersService } from 'src/app/shared/services/followers/followers.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../app/shared/models/user';
import { UsersService } from '../../../app/shared/services/users/users.service';
import { map } from 'rxjs/operators';

const HEADERS = {
  followers: 'Followers',
  followings: 'Followings',
};

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filterValue: string;
  header: string;
  private userId: string;
  private routeParamsSubscription: Subscription;

  constructor(
    private followers: FollowersService,
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) { }


  ngOnInit(): void {
    this.userId = this.route.parent.snapshot.params.id;
    this.routeParamsSubscription = this.route.queryParamMap
      .subscribe(params => {
        const value = params.get('base');
        if (value !== this.filterValue) {
          this.header = HEADERS[value];
          this.filterValue = value;
          this._getFilteredUsers();
        }
      });
  }

  private _getFilteredUsers() {
    let followers$;
    if (this.filterValue === 'followers') {
      followers$ = this.followers.getFollowersIds(this.userId);
    }
    if (this.filterValue === 'followings') {
      followers$ = this.followers.getFollowingsIds(this.userId);
    }

    followers$.pipe(
      map((ids: string[]) => {
        if (ids?.length) {
          const users = this.usersService.getUsers();
          return users.filter((user: User) => ids.includes(user.id));
        } else {
          return [];
        }
      })
    ).subscribe((users: User[]) => this.users = users);
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
  }
}
