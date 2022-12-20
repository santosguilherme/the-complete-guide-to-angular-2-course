import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../environments/environment"

import { User } from "./user.model";

export interface AuthResponseData {
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

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;


  constructor(private httpClient: HttpClient, private router: Router) {
  }

  signUp(email: string, password: string) {
    const API_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.FIREBASE_API_KEY;

    return this.httpClient
      .post<AuthResponseData>(API_BASE_URL, {email, password, returnSecureToken: true})
      .pipe(
        catchError(this.handleError),
        tap(response => {
          const {email, localId, idToken, expiresIn} = response;

          this.handleAuthentication(email, localId, idToken, +expiresIn);
        })
      );
  }

  login(email: string, password: string) {
    const API_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.FIREBASE_API_KEY;

    return this.httpClient
      .post<AuthResponseData>(API_BASE_URL, {email, password, returnSecureToken: true})
      .pipe(
        catchError(this.handleError),
        tap(response => {
          const {email, localId, idToken, expiresIn} = response;

          this.handleAuthentication(email, localId, idToken, +expiresIn);
        })
      );
  }

  autoLogin() {
    const userDataRaw = localStorage.getItem('userData');

    if (!userDataRaw) {
      return;
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
      this.user.next(user);

      const expirationDuration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(DEFAULT_ERROR_MESSAGE);
    }

    const errorMessage = ERROR_MESSAGES[errorResponse.error.error.message];

    return throwError(errorMessage || DEFAULT_ERROR_MESSAGE);
  }

  private handleAuthentication(email: string,
                               userId: string,
                               token: string,
                               expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
