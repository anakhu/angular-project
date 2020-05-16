import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/models/user';
import { Course } from '../../shared/models/course';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { UsersService } from 'src/shared/services/users/users.service';
import { Subscription, from, of } from 'rxjs';
import { mergeAll, map, mergeMap, catchError } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { LoginUser } from 'src/shared/services/auth/login.user';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  userId: string;
  user: User;
  authUserId: string;

  isFollowing: boolean;

  userCourses = {
    likedCourses: [],
    enrolledCourses: [],
    authoredCourses: [],
  };

  routerSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
   this._authSubscribe();
   this._subscribeOnParamsChange();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  private _authSubscribe(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: LoginUser) => {
        this.authUserId = user?.id || null;
      });
  }

  private _subscribeOnParamsChange(): void {
    this.routerSubscription = this.activatedRoute.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (this.user) {
          this._refreshUserCourses();
        }
        this.userId = paramMap.get('id');
        this._loadUserPage();
    });
  }

  private _loadUserPage() {
    this._setUser();
    this._initUser();
  }

  private _setUser(): void {
    this.usersService
      .getUser(this.userId)
        .subscribe(
          (user: User) => {
            this.user = user;
          },
          (error: Error) => this.router.navigate(['/404']),
      );
  }

  private _initUser(): void {
    if (this.user) {
      this._getUserCourses();
    }
  }

  private _refreshUserCourses(): void {
    Object.keys(this.userCourses).forEach((key: string) => {
      this.userCourses[key].length = 0;
    });
  }

  private _getUserCourses(): void {
    from(Object.keys(this.userCourses))
      .pipe(
        mergeMap((key: string) => of(this.user[key])
          .pipe(
            catchError(error => []),
            mergeAll(),
            mergeMap((id: string) => this.coursesService.getById(id)),
            map((course: Course) => {
              return { key, course };
            })
          ))
      )
      .subscribe(
        ({key, course}: any) => this.userCourses[key].push(course));
  }

}
