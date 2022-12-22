import { Actions, ofType, createEffect } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { of, switchMap, tap, throwError } from "rxjs";

import { environment } from "../../../environments/environment";
import * as AuthActions from './auth.actions';
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const ERROR_MESSAGES = {
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
  EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
  USER_DISABLED: 'The user account has been disabled by an administrator.'
};

const DEFAULT_ERROR_MESSAGE = 'An unknown error occurred!';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse) => {
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(DEFAULT_ERROR_MESSAGE));
  }

  const errorMessage = ERROR_MESSAGES[errorResponse.error.error.message];

  return of(new AuthActions.AuthenticateFail(errorMessage || DEFAULT_ERROR_MESSAGE));
};

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        const API_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.FIREBASE_API_KEY;

        return this.httpClient
          .post<AuthResponseData>(API_BASE_URL, {
              email: authData.payload.email,
              password: authData.payload.email,
              returnSecureToken: true
            }
          )
          .pipe(
            tap((response) => {
              this.authService.setLogoutTimer(+response.expiresIn * 1000);
            }),
            map(response => {
              return handleAuthentication(
                +response.expiresIn,
                response.email,
                response.localId,
                response.idToken
              );
            }),
            catchError(errorResponse => {
              return handleError(errorResponse);
            })
          );
      }),
    );
  });

  authRedirect = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if (authSuccessAction.payload.redirect) {
          this.router.navigate(['/']);
        }
      })
    );
  }, {dispatch: false});

  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    );
  }, {dispatch: false});

  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        const API_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.FIREBASE_API_KEY;

        return this.httpClient
          .post<AuthResponseData>(API_BASE_URL, {
            email: signupAction.payload.email,
            password: signupAction.payload.email,
            returnSecureToken: true
          })
          .pipe(
            tap((response) => {
              this.authService.setLogoutTimer(+response.expiresIn * 1000);
            }),
            map(response => {
              return handleAuthentication(
                +response.expiresIn,
                response.email,
                response.localId,
                response.idToken
              );
            }),
            catchError(errorResponse => {
              return handleError(errorResponse);
            })
          );
      })
    );
  });

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userDataRaw = localStorage.getItem('userData');

        if (!userDataRaw) {
          return {type: 'DUMMY'};
        }

        const {
          email,
          id,
          _token,
          _tokenExpirationDate
        }: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: string,
        } = JSON.parse(userDataRaw);

        const user = new User(email, id, _token, new Date(_tokenExpirationDate));

        if (user.token) {
          const expirationDuration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.AuthenticateSuccess({
            email: email,
            userId: id,
            token: _token,
            expirationDate: new Date(_tokenExpirationDate),
            redirect: false
          });
        }

        return {type: 'DUMMY'};
      })
    );
  });

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }
}
