import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, tap, filter } from 'rxjs/operators';
import { dateValidator } from './date.validator';
import { dateConflictValidator } from './date-conflict.validator';
import { Subscription, Observable } from 'rxjs';
import { FileValidator } from 'ngx-material-file-input';
import { CourseFormData } from 'src/app/shared/models/courses/courseFormData';
import { AppState } from 'src/app/store/app.reducer';
import { Store, Action, ActionsSubject } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';
import * as fromCoursesActions from 'src/app/store/courses/courses.actions';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit, OnDestroy {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  public courseForm: FormGroup;
  public isLoading = false;
  public authUserId$: Observable<string>;
  private actionSubjSubscription: Subscription;
  readonly maxSize = 400000;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private store: Store<AppState>,
    private actionSbj: ActionsSubject
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._createActionSubjSubscription();
    this.authUserId$ = this.store.select(selectAuthUserUid);
  }

  ngOnDestroy(): void {
    this.actionSubjSubscription.unsubscribe();
  }

  public triggerResize(): void {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public submitForm(): void {
    this.isLoading = true;
    this.authUserId$
      .pipe(
        take(1),
        tap((userId: string) => {
          if (userId) {
            const newCourseData: {courseData: CourseFormData, authorId: string} = {
              courseData: this.courseForm.value as CourseFormData,
              authorId: userId,
            };
            this.store.dispatch(new fromCoursesActions.AddCourseStartAction(newCourseData));
        }})
      )
      .subscribe();
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

  private _createActionSubjSubscription(): void {
    this.actionSubjSubscription = this.actionSbj
      .pipe(
        filter((action: Action) => {
          const { ADD_COURSE_SUCCESS, ADD_COURSE_FAILED } = fromCoursesActions;
          return action.type === ADD_COURSE_SUCCESS ||  action.type === ADD_COURSE_FAILED;
        })
      )
      .subscribe(() => this.isLoading = false);
  }

}
