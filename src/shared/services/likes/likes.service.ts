import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Course } from 'src/shared/models/course';
import { User } from 'src/shared/models/user';
import { UsersService } from '../users/users.service';
import { mergeAll, tap, map, findIndex, exhaustMap, concatMap, mapTo, mergeMap } from 'rxjs/operators';
import { of, Subscription, Observable, from } from 'rxjs';
import { CoursesService } from '../courses/courses.service';
import { LoginUser } from 'src/shared/services/auth/login.user';


@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private authUser: User;
  private authUserId: string;
  private userSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private coursesService: CoursesService,
  ) {
    this.authSubscribe();
  }

  private authSubscribe(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((loginUser: LoginUser) => {
        if (loginUser) {
          this.authUserId = loginUser.id;
          this.usersService.getUser(this.authUserId)
            .subscribe((user: User) => this.authUser = user);
          this._userSubscribe();
        } else {
          this.authUserId = null;
          this.authUser = null;
          if (this.userSubscription) {
            this.userSubscription.unsubscribe();
          }
        }
      });
  }

  private _userSubscribe(): void {
    this.userSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => {
        const user = users
          .find((currentUser: User) => currentUser.id === this.authUserId);
        if (this.authUser !== user) {
          this.authUser = user;
        }
      });
  }

  public getLikeStatus(courseId: string): boolean {
    if (this.authUser?.likedCourses) {
      const courseIndex = this.authUser.likedCourses.indexOf(courseId);
      return courseIndex === -1 ? false : true;
    }
    return false;
  }


  public changeLikeStatus(courseId: string): Observable<number> {
    return of(this.authUser)
      .pipe(
        map((user: User) => {
          if (user.likedCourses?.length) {
            return from(user.likedCourses);
          } else {
            return from([]);
          }
        }),
        mergeAll(),
        findIndex((id: string) => id === courseId),
        concatMap((index: number) => {
          if (index === -1) {
            return this._like(this.authUser, courseId).pipe(mapTo(1));
          } else {
            return this._unlike(this.authUser, courseId).pipe(mapTo(-1));
          }
        }),
        concatMap((point: number) => {
          return this.updateCourse(courseId, point)
            .pipe(
              map((course: Course) => {
                if (course) {
                  return point;
                }
              })
            );
        }),
      );
  }

  private _like(user: User, courseId: string): Observable<User> {
    const updatedUser = {...user};
    if (!updatedUser.likedCourses) {
      updatedUser.likedCourses = [];
    }
    updatedUser.likedCourses.push(courseId);
    return this.usersService.updateUserDetail({...updatedUser});
  }

  private _unlike(user: User, courseId: string): Observable<User> {
    const updatedCourses = this.authUser.likedCourses
      .filter((id: string) => id !== courseId);
    return this.usersService.updateUserDetail({...this.authUser, likedCourses: updatedCourses});
  }


  private updateCourse(courseId: string, point: number): Observable<Course> {
    return this.coursesService.getById(courseId)
      .pipe(
        concatMap((course: Course) => {
          if (course) {
            const updatedCourse = course;
            updatedCourse.likes += point;

            return this.coursesService.updateCourse(updatedCourse);
          }
        })
      );
  }
}

