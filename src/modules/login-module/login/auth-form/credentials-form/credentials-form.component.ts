import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { passwordMatchValidator } from './password.validator';

export interface CredentialsFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-credentials-form',
  templateUrl: './credentials-form.component.html',
  styleUrls: ['./credentials-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CredentialsFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CredentialsFormComponent),
      multi: true
    }
  ]
})
export class CredentialsFormComponent implements ControlValueAccessor, OnInit, OnDestroy {

  form: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {}

  get value(): CredentialsFormValues {
    return this.form.value;
  }

  set value(value: CredentialsFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get email(): any {
    return this.form.get('email');
  }

  get password(): any {
    return this.form.get('password');
  }

  get confirmPassword(): any {
    return this.form.get('confirmPassword');
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { credentials: { valid: false } };
  }

  ngOnInit(): void {
    this.initForm();
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initSubscriptions(): void {
    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required]
    }, { validator: passwordMatchValidator() });
  }
}
