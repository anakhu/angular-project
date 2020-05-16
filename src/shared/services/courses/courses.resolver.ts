import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Course } from '../../models/course';
import { Observable } from 'rxjs';
import { CoursesService } from './courses.service';


@Injectable({
  providedIn: 'root',
})

export class CoursesResolver implements Resolve<Course[]> {
  constructor(private coursesService: CoursesService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course[]> {
    return this.coursesService.loadCourses();
  }
}
