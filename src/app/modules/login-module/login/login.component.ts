import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LOGIN_THUMBS, ThumbIcon } from './loginPageIcons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public displayedComponent: string | undefined;
  private queryParamsSubscription: Subscription;
  readonly loginIcons: ThumbIcon[] = LOGIN_THUMBS;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._createQueryParamsSubscription();
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  private _createQueryParamsSubscription(): void {
    this.queryParamsSubscription = this.route.queryParamMap
      .pipe(
        tap(x => console.log(x)),
        pluck('params'),
        pluck('action'),
      )
    .subscribe((componentName: string) => {
      this.displayedComponent = componentName;
    });
  }
}
