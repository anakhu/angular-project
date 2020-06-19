import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CourseComponent,
  CourseDetailComponent,
  CoursesComponent,
  LikeButtonComponent,
  EnrollBtnComponent,
  CommentComponent,
  CoursePreviewComponent,
  CourseStudentComponent
} from './index';
import { MaterialModule } from '../material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoursesRoutingModule } from './courses-routing';
import { SharedModule } from '../shared-module/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    CourseComponent,
    CourseDetailComponent,
    CoursesComponent,
    LikeButtonComponent,
    EnrollBtnComponent,
    CommentComponent,
    CourseStudentComponent,
    CoursePreviewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoursesRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
  exports: [
    CourseComponent,
    CoursePreviewComponent
  ]
})
export class CoursesModule { }
