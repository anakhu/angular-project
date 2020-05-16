import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormBuilder, ControlValueAccessor, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface ProfileFormValues {
  name: string;
  country: string;
  occupation: string;
  image?: string;
}

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProfileFormComponent),
      multi: true
    }
  ]
})
export class ProfileFormComponent implements ControlValueAccessor, OnInit, OnDestroy{
  form: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
  ) { }

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
    return this.form.valid ? null : { profile: { valid: false } };
  }

  get value(): ProfileFormValues {
    return this.form.value;
  }

  set value(value: ProfileFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get name(): any {
    return this.form.get('name');
  }

  get country(): any {
    return this.form.get('country');
  }

  get occupation(): any {
    return this.form.get('occupation');
  }

  ngOnInit(): void {
    this.initForm();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      occupation: ['', Validators.required],
      image: [],
    });
  }

  private initSubscriptions() {
    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

}
