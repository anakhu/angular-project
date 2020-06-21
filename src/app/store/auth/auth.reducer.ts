import { LoggedInUser } from '../../shared/models/user/loggedInUser';
import { AuthActions, LOGIN_SUCCESS, LOGOUT_END, USER_IS_LOADING, SIGN_UP_FAILED } from './auth.actions';

export interface AuthState {
  user: LoggedInUser;
  isLoading: boolean;
}

export const  initialAuthState: AuthState = {
  user: null,
  isLoading: false,
};

export function authReducer(state: AuthState = initialAuthState, action: AuthActions) {
  switch (action.type) {
    case USER_IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case SIGN_UP_FAILED:
    case LOGOUT_END:
      return {
        ...state,
        user: null,
        isLoading: false,
      };
    default:
      return state;
  }
}
