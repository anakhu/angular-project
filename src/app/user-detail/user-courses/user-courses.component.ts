import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../shared/models/course';

@Component({
  selector: 'app-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.scss']
})
export class UserCoursesComponent implements OnInit {
  @Input() courses: Course [];
  @Input() header: string;
  constructor() { }

  ngOnInit(): void {
  }

}
