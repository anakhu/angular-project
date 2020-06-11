import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, finalize, switchMap } from 'rxjs/operators';
import { CoursesService } from 'src/app/shared/services/courses/courses.service';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { dateValidator } from './date.validator';
import { dateConflictValidator } from './date-conflict.validator';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { Router } from '@angular/router';
import { FileValidator } from 'ngx-material-file-input';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit, OnDestroy {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  courseForm: FormGroup;
  authorId: string;
  isLoading = false;
  authSubscription: Subscription;
  readonly maxSize = 400000;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private courses: CoursesService,
    private auth: AuthService,
    // private ngxService: NgxUiLoaderService,
    private notifications: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._subscribe();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  public triggerResize(): void {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public submitForm(): void {
    // this.ngxService.start();
    this.isLoading = true;
    this.courses.addCourse(this.courseForm.value, this.authorId)
      .pipe(
        switchMap((result: string) => result),
        finalize(() => this.isLoading = false)
      )
      .subscribe((key: string) => {
        this.notifications.createNotification('Course successfully added');
        this.router.navigate(['/courses', key]);
      });
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

  private _initForm() {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.minLength(30)]],
      startDate: ['', { validators: [Validators.required, dateValidator()], updateOn: 'blur'}],
      endDate: ['', { validators: [Validators.required, dateValidator()], updateOn: 'blur'}],
      price: ['', [Validators.required, Validators.min(0)]],
      certificate: [''],
      image: ['', [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
    }, { validator: dateConflictValidator() });
  }

  private _subscribe() {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser | null) => user ? this.authorId = user.uid : null);
  }

}
