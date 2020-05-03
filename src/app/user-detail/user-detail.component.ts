import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/models/user';
import { Course } from '../../shared/models/course';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { UsersService } from 'src/shared/services/users/users.service';
import { EMPTY, Subscription, from, of } from 'rxjs';
import { tap, catchError, mergeAll, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  userId: number;
  user: User;

  isAuthUser: boolean;
  isUserLoggedIn: boolean;
  isFollowing: boolean;

  userCourses = {
    likedCourses: [],
    enrolledCourses: [],
    authoredCourses: [],
  };

  userFollowings = {
    followers: [],
    followings: [],
  };

  routerSubscription: Subscription;

  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
   this.subscribeOnParamsChange();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private subscribeOnParamsChange(): void {
    this.routerSubscription = this.activatedRoute.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (this.user) {
          this.refreshUserCourses();
        }
        this.userId = +paramMap.get('id');
        this.loadUserPage();
    });
  }

  private loadUserPage() {
    this.setUser();
    this.initUser();
  }

  private setUser(): void {
    this.usersService
      .getUser(this.userId)
      .pipe(
        tap((result: User | Error) => {
          if (result instanceof Error) {
            throw result;
          }
        }),
        catchError((err: Error) => {
          console.log(err.message);
          return EMPTY;
        }),
      ).subscribe((user: User) => {
        this.user = user;
      });
  }

  private initUser(): void {
    if (this.user) {
      this.getUserCourses();
      this.getFollowers();
      this.isAuthUserFollower();
      this.checkUserAuthStatus();
    }
  }

  private refreshUserCourses(): void {
    Object.keys(this.userCourses).forEach((key: string) => {
      this.userCourses[key].length = 0;
    });
  }

  private getUserCourses(): void {
    from(Object.keys(this.userCourses))
      .pipe(
        mergeMap((key: string) => of(this.user[key])
          .pipe(
            mergeAll(),
            mergeMap((id: number) => this.coursesService.getById(id)),
            map((course: Course) => {
              return { key, course };
            })
          ))
      )
      .subscribe(({key, course}: any) => this.userCourses[key].push(course));
  }

  private getFollowers(): void {
    this.usersService.getFollowersObj(this.userId)
      .subscribe((result) => this.userFollowings = result);
  }

  private isAuthUserFollower(): void {
    const followerId = this.authService.getAuthUserId();
    const followingUser = this.userFollowings.followers
      .find(({id: userId}: User) => userId === followerId);

    this.isFollowing = !!followingUser;
  }

  private checkUserAuthStatus(): void {
    const authUserId = this.authService.getAuthUserId();
    if (this.userId === authUserId) {
      this.isAuthUser = true;
    } else {
      this.isAuthUser = false;
    }
    this.isUserLoggedIn = this.authService.isLoggedIn;
  }

  public onFollowStatusToggle(status: boolean): void {
    const authUserId = this.authService.getAuthUserId();
    this.usersService.changeUserFollowingStatus(status, this.userId, authUserId);
    this.getFollowers();
  }
}
