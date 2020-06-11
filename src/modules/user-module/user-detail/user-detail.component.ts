import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../app/shared/models/user';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService, FireBaseUser } from '../../../app/shared/services/auth/auth.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserNotificationsComponent } from '../notifications/user-notifications.component';
import { mergeAll, filter, take, first } from 'rxjs/operators';

const COMPONENT_MAP = {
  1: UserEditComponent,
};

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  componentList = COMPONENT_MAP;
  userId: string;
  user: User;
  authUserId: string;
  currentUser$: Observable<User>;

  routerSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private users: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this._authSubscribe();
    this._subscribeOnParamsChange();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  public processClick(path: string, content: string) {
    this.router.navigate(['/users', this.userId, path], { queryParams: { base: content}});
  }

  private _authSubscribe(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => {
        this.authUserId = user?.uid || null;
      });
  }

  private _subscribeOnParamsChange(): void {
    this.routerSubscription = this.activatedRoute.paramMap
      .subscribe((paramMap: ParamMap) => {
        this.userId = paramMap.get('id');
        this._loadUserPage();
    });
  }

  private _loadUserPage() {
    this._setUser();
  }

  private _setUser(): void {
    this.currentUser$ = this.users.createSubscription()
      .pipe(
        mergeAll(),
        filter((user: User) => this.userId === user.id),
      );
  }
}
