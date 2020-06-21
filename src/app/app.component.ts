import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthUserUid } from './store/auth/auth.selectors';
import { AppState } from './store/app.reducer';
import * as fromAuthReducer from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
  .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  @ViewChild('toolbar', {static: true}) toolbar: ElementRef;
  authUserId$: Observable<string>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
  ) {}


  ngOnInit(): void {
    this.authUserId$ = this.store.select(selectAuthUserUid);
  }

  public logout(): void {
    this.store.dispatch(new fromAuthReducer.LogoutStartAction());
  }
}
