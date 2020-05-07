import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/models/user';
import { Course } from '../../shared/models/course';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { UsersService } from 'src/shared/services/users/users.service';
import { Subscription, from, of } from 'rxjs';
import { mergeAll, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth/auth.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
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

  routerSubscription: Subscription;

  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
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
        .subscribe(
          (user: User) => this.user = user,
          (error: Error) => this.router.navigate(['/404']),
      );
  }

  private initUser(): void {
    if (this.user) {
      this.getUserCourses();
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

  private checkUserAuthStatus(): void {
    const authUserId = this.authService.getAuthUserId();
    if (this.userId === authUserId) {
      this.isAuthUser = true;
    } else {
      this.isAuthUser = false;
    }
    this.isUserLoggedIn = this.authService.isLoggedIn;
  }
}
