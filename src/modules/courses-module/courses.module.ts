import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CourseComponent,
  CourseDetailComponent,
  CoursesComponent,
  LikeButtonComponent
} from '../courses-module/courses/index';
import { MaterialModule } from '../material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoursesRoutingModule } from './courses-routing';
import { SharedModule } from '../shared-module/shared.module';
import { EnrollBtnComponent } from './courses/course/enroll-btn/enroll-btn.component';
import { CommentComponent } from './courses/course-detail/comment/comment.component';


@NgModule({
  declarations: [
    CourseComponent,
    CourseDetailComponent,
    CoursesComponent,
    LikeButtonComponent,
    EnrollBtnComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoursesRoutingModule,
    SharedModule,
  ],
  exports: [
    CourseComponent
  ]
})
export class CoursesModule { }
