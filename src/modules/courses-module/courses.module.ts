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


@NgModule({
  declarations: [
    CourseComponent,
    CourseDetailComponent,
    CoursesComponent,
    LikeButtonComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoursesRoutingModule
  ],
  exports: [
    CourseComponent
  ]
})
export class CoursesModule { }
