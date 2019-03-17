import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../models/Auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenTimer: any;
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>(); // auth sesstion listener
  constructor(private httpService: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable(); // listening
  }

  createUser(email: string, password: string) {
    const auth: Auth = {email: email, password: password};
    this.httpService.post('http://localhost:3000/api/auth/register', auth)
      .subscribe(response => {
        console.log(response); // TODO: add alert library
      });
  }

  userLogin(email: string, password: string) {
    const auth: Auth = {email: email, password: password};
    this.httpService.post<{token: string, expiresIn: number}>('http://localhost:3000/api/auth/login', auth)
      .subscribe(response => { // storing token in the auth
        const token = response.token;
        this.token = token;
        if (token) {
          const tokenDuration = response.expiresIn;
          this.setAuthTimer(tokenDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true); // allow for other components to check if user is logged in
          const now = new Date();
          const expirationDate = new Date(now.getTime() + tokenDuration * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  userLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.userLogout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
