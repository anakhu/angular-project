import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EMPTY, of, Subscription } from 'rxjs';
import { UsersService } from 'src/shared/services/users/users.service';
import { User } from 'src/shared/models/user';
import { tap, catchError, mergeAll, mergeMap, toArray } from 'rxjs/operators';
import { CoursesService } from 'src/shared/services/courses/courses.service';
import { Course } from 'src/shared/models/course';
import { AuthService } from 'src/shared/services/auth/auth.service';

const ALIAS = {
  'authored-courses': 'authoredCourses',
  'enrolled-courses': 'enrolledCourses',
  'liked-courses': 'likedCourses',
  followers: 'followers',
  followings: 'followings',
};

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit, OnDestroy {

  userId: number;
  user: User;
  contentName: string;
  contentToDisplay: any[];
  authStatus: boolean;
  routeSubscription: Subscription;
  likesSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private coursesService: CoursesService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.createParamMapsubscription();
    this.createAuthSubscription();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  private createParamMapsubscription(): void {
    this.routeSubscription = this.activatedRoute.paramMap
      .subscribe((paramMap: ParamMap) => {
        this.userId = +paramMap.get('id');
        this.contentName = paramMap.get('detail');

        if (!Object.prototype.hasOwnProperty.call(ALIAS, this.contentName)) {
          this.redirect();
          return;
        }

        if (this.userId) {
          this.getUserbyId(this.userId);
          this.distinctContent(this.contentName);
        }
    });
  }

  private createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((authStatus: boolean) => this.authStatus = authStatus);
  }

  private getUserbyId(id: number): void {
    this.usersService.getUser(id)
      .pipe(
        tap((result: User | Error) =>  {
          if (result instanceof Error) {
            throw result;
          }
        }),
        catchError((error: Error) => {
          console.log(error.message);
          return EMPTY;
        })
      )
      .subscribe((user: User) => this.user = user);
  }

  private distinctContent(contentName: string): void {
    if (contentName.includes('courses')
      && Object.prototype.hasOwnProperty.call(ALIAS, contentName)
      ) {
      const key = ALIAS[contentName];
      const coursesIds: number[] = this.user[key];
      this.getCourses(coursesIds);
    }

    if (contentName.includes('follow')
      && Object.prototype.hasOwnProperty.call(ALIAS, contentName)
      ) {
      this.getFollowers(contentName);
    }
  }

  private getCourses(ids: number[]): void {
    of(ids)
      .pipe(
        mergeAll(),
        mergeMap((id: number) => this.coursesService.getById(id)),
        toArray()
      )
    .subscribe((courses: Course[]) => this.contentToDisplay = courses);
  }

  private getFollowers(contentName: string): void {
    this.usersService.getFollowersObj(this.userId)
      .subscribe((followers: any) => {
        const key = ALIAS[contentName];
        this.contentToDisplay = followers[key];
    });
  }

  private redirect(): void {
    this.router.navigate(['/404']);
  }
}
