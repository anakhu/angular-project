import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Course } from 'src/shared/models/course';
import { User } from 'src/shared/models/user';
import { UsersService } from '../users/users.service';
import { tap, catchError, mergeAll, filter, toArray } from 'rxjs/operators';
import { EMPTY, of, Subscription } from 'rxjs';
import { CoursesService } from '../courses/courses.service';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  authUser: User;
  userSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private coursesService: CoursesService,
  ) { }

  private usersSubscribe(): void {
    this.userSubscription = this.usersService.createSubscription()
      .subscribe(() => {
        this.getAuthUser();
      });
  }

  private authSubscribe(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((authStatus: boolean) => {
        if (authStatus) {
          this.getAuthUser();
        } else {
          this.authUser = undefined;
        }
      });
  }

  private getAuthUser(): void {
    const authUserId: number = this.authService.getAuthUserId();
    this.usersService.getUser(authUserId)
      .pipe(
        tap((result: User | Error) => {
          if (result instanceof Error) {
            throw result;
            }
          }),
        catchError((error: Error) => {
            console.log(error.message);
            return EMPTY;
          })
        )
      .subscribe((user: User) => this.authUser = user);
  }

  public getLikeStatus(courseId: number): boolean {
    const courseIndex = this.authUser.likedCourses.indexOf(courseId);
    return courseIndex === -1 ? false : true;
  }

  public toggleLikeStatus(courseId: number): void {
    const likeStatus = !this.getLikeStatus(courseId);
    this.updateUserLikes(likeStatus, courseId);
  }

  private updateUserLikes(likeStatus: boolean, courseId: number): void {
    likeStatus ? this.like(courseId) : this.unlike(courseId);
  }

  private unlike(courseId: number): void {
    of(this.authUser.likedCourses)
      .pipe(
        mergeAll(),
        filter((id: number) => id !== courseId ),
        toArray(),
      )
      .subscribe((ids: number[]) => {
        const updatedUser: User = {...this.authUser, likedCourses: [...ids] };
        this.usersService.updateUserDetail(updatedUser);
        this.updateCourse(courseId, -1);
      });
  }

  private like(courseId: number): void {
    const ids = [...this.authUser.likedCourses];
    ids.push(courseId);
    const updatedUser: User = {...this.authUser, likedCourses: ids };
    this.usersService.updateUserDetail(updatedUser);
    this.updateCourse(courseId, 1);
  }

  private updateCourse(courseId: number, point: number): void {
    let courseToUpdate;
    this.coursesService.getById(courseId)
      .pipe(
        tap((result: Course | Error) => {
          if (result instanceof Error) {
            throw result;
          }
        }),
        catchError((err: Error) => {
          console.log(err.message);
          return EMPTY;
        })
      )
      .subscribe((course: Course) => courseToUpdate = {...course});

    courseToUpdate.likes += point;
    this.coursesService.updateCourse(courseToUpdate);
  }

  init() {
    this.authSubscribe();
    this.usersSubscribe();
  }
}

