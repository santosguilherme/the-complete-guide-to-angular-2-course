import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
  const {type} = action;

  if (type === AuthActions.AUTHENTICATE_SUCCESS) {
    const user = new User(
      action.payload.email,
      action.payload.userId,
      action.payload.token,
      action.payload.expirationDate
    );

    return {
      ...state,
      authError: null,
      loading: false,
      user
    };
  }

  if (type === AuthActions.LOGIN_START || type === AuthActions.SIGNUP_START) {
    return {
      ...state,
      authError: null,
      loading: true
    };
  }

  if (type === AuthActions.AUTHENTICATE_FAIL) {
    return {
      ...state,
      user: null,
      loading: false,
      authError: action.payload
    };
  }

  if (type === AuthActions.LOGOUT) {
    return {
      ...state,
      user: null
    };
  }

  if (type === AuthActions.CLEAR_ERROR) {
    return {
      ...state,
      authError: null
    };
  }

  return state;
}
