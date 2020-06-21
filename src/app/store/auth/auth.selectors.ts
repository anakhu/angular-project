import { createSelector, select } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { AppState } from '../app.reducer';

export const selectAuthState = (state: AppState) => state.auth;

export const selectAuthUser = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.user
);

export const selectUserLoadingStatus = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.isLoading
);

export const selectAuthUserUid = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.user ? auth.user.uid : null);
