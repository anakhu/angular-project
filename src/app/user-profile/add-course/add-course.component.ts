import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from 'src/shared/models/course';
import { CoursesService } from '../../../shared/services/courses.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})

export class AddCourseComponent implements OnInit {

  newCourse: Course;

  @Input() name: string;
  @Input() content: string;
  @Input() author: string;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() price: string;
  @Input() sessions: string;
  @Input() studentsMax: string;
  @Input() certificate: boolean;

  @Output() addedCourseEvent = new EventEmitter<Course>();

  constructor(
    private coursesService: CoursesService,
  ) { }

  ngOnInit(): void {
  }

  onAddBtnClick() {
    this.newCourse = {
      id: 10,
      name: this.name,
      image: './assets/images/default.jpg',
      content: this.content,
      author: this.author,
      startDate: this.startDate.toString(),
      endDate: this.endDate.toString(),
      price: +this.price,
      sessions: +this.sessions,
      studentsMax: +this.studentsMax,
      certificate: !!this.certificate,
    };

    this.coursesService.addCourse(this.newCourse);
    this.addedCourseEvent.emit(this.newCourse);
  }

}
