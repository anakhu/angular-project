import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { User } from '../../../shared/models/user';
import { Course } from '../../../shared/models/course';
import { CoursesService } from '../../../shared/services/courses/courses.service';
import { UsersService } from 'src/shared/services/users/users.service';
import { partition, EMPTY, from, Subscription } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId;
  user: User;
  errorMessage: string;
  userCourses = {
    likedCourses: [],
    enrolledCourses: [],
    authoredCourses: [],
  };
  userSubscription: Subscription;

  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.subscribe();
  }

  ngOnChanges(): void {
    // debugger
    console.log('changes');
    this.initUser();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  private subscribe(): void {
    this.userSubscription = this.usersService.createSubscription()
      .subscribe(x => {
        console.log(x, 'users changed; refreshing user');
        this.initUser();
      });
  }

  private initUser() {
    this.setUser();
    this.resetUserDetail();
    this.refreshUserCourses();
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
        catchError((error: Error) => {
          console.log(error.message);
          return EMPTY;
        }),
      ).subscribe((user: User) => {
        this.user = user;
      });
  }

  private refreshUserCourses(): void {
    Object.keys(this.userCourses)
      .forEach(key => {
        this.user[key].forEach((id) => {
          this.coursesService.getById(id) // add error handler
            .subscribe((result: Course) => this.userCourses[key].push(result));
        });
      });
  }

  private resetUserDetail() {
    Object.keys(this.userCourses)
      .forEach(key => this.userCourses[key].length = 0);
  }
}
