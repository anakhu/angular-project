import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { dateValidator } from './date.validator';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit, OnDestroy {
  courseForm: FormGroup;
  authorId: string;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  authSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    // private uploads: UploadService,
    private courses: CoursesService,
    private auth: AuthService
  ) { }

  public triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  private _subscribe() {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser | null) => user ? this.authorId = user.uid : null);
  }

  ngOnInit(): void {
    this.initForm();
    this._subscribe();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  get name() {
    return this.courseForm.get('name');
  }

  get content() {
    return this.courseForm.get('content');
  }

  get startDate() {
    return this.courseForm.get('startDate');
  }

  get endDate() {
    return this.courseForm.get('endDate');
  }

  get price() {
    return this.courseForm.get('price');
  }

  get certificate() {
    return this.courseForm.get('certificate');
  }

  get image() {
    return this.courseForm.get('image');
  }

  private initForm() {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.minLength(30)]],
      startDate: ['', { validators: [Validators.required, dateValidator()], updateOn: 'blur'}],
      endDate: ['', { validators: [Validators.required, dateValidator()], updateOn: 'blur'}],
      price: ['', [Validators.required, Validators.min(0)]],
      certificate: [''],
      image: ['', [Validators.required]]
    });
  }

  public submitForm() {
    console.log(this.courseForm.value);
    this.courses.addCourse(this.courseForm.value, this.authorId)
      .subscribe(x => console.log(x));
  }

}
