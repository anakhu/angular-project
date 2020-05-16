import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { fromEvent, Subscription, EMPTY } from 'rxjs';
import { switchMap, catchError, pluck } from 'rxjs/operators';
import { AuthUser } from '../../shared/models/authUsers';
import { Router, ActivatedRoute, QueryParamsHandling } from '@angular/router';
import { NgForm } from '@angular/forms';

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
