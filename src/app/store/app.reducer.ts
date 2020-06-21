import * as fromAuthReducer from '../store/auth/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuthReducer.AuthState,
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuthReducer.authReducer,
};

