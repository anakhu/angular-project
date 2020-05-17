import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/models/user';
import { mergeAll, mergeMap, toArray } from 'rxjs/operators';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { Course } from 'src/app/shared/models/course';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoginUser } from '../shared/services/auth/login.user';
import { FollowersService } from '../shared/services/followers/followers.service';

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
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit, OnDestroy {

  userId: string;
  user: User;
  contentName: string;
  contentToDisplay: any[];
  authUserId: string;

  routeSubscription: Subscription;
  likesSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private coursesService: CoursesService,
    private authService: AuthService,
    private followersService: FollowersService,
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
        this.userId = paramMap.get('id');
        this.contentName = paramMap.get('detail');

        if (!ALIAS[this.contentName] || !this.userId) {
          this.redirect();
          return;
        }

        if (this.userId) {
          this.getUserbyId(this.userId);
        }

        if (this.user) {
          this.distinctContent(this.contentName);
        }
    });
  }

  private createAuthSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: LoginUser) => this.authUserId = user ? user.id : null);
  }

  private getUserbyId(id: string): void {
    this.usersService.getUser(id)
      .subscribe(
        (user: User) => this.user = user,
        (error: Error) => this.redirect()
      );
  }

  private distinctContent(contentName: string): void {
    if (contentName.includes('courses') && ALIAS[this.contentName]) {
      const key = ALIAS[contentName];
      const coursesIds: string[] = this.user[key];
      this.getCourses(coursesIds);
    }

    if (contentName.includes('follow') && ALIAS[this.contentName]) {
      this.getFollowers(contentName);
    }
  }

  private getCourses(ids: string[]): void {
    of(ids)
      .pipe(
        mergeAll(),
        mergeMap((id: string) => this.coursesService.getById(id)),
        toArray()
      )
    .subscribe((courses: Course[]) => this.contentToDisplay = courses);
  }

  private getFollowers(contentName: string): void {
    this.followersService.getFollowersObj(this.userId)
      .subscribe((followers: any) => {
        const key = ALIAS[contentName];
        this.contentToDisplay = followers[key];
    });
  }

  private redirect(): void {
    this.router.navigate(['/404']);
  }
}
