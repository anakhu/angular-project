import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersResolver } from '../../app/shared/services/users/users.resolver';
import { CoursesResolver } from '../../app/shared/services/courses/courses.resolver';
import { CoursesComponent } from './courses/courses.component';


const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    resolve: { UsersResolver, CoursesResolver },
    children: [
      { path: ':id', component: CoursesComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }

