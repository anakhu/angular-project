import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  queryParamsSubscription: Subscription;
  displayedComponent: string | undefined;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._createQueryParamsSubscription();
  }

  ngOnDestroy(): void {}


  private _createQueryParamsSubscription(): void {
    this.queryParamsSubscription = this.route.queryParamMap
      .pipe(
        pluck('params'),
        pluck('action'),
      )
    .subscribe((componentName: string) => {
      this.displayedComponent = componentName;
    });
  }
}
