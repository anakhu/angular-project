import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Course } from '../../models/courses/course';
import { Observable } from 'rxjs';
import { CoursesService } from './courses.service';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})

export class CoursesResolver implements Resolve<Course[]> {
  constructor(private coursesService: CoursesService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course[]> {
    return this.coursesService.loadCourses().pipe(take(1));
  }
}
