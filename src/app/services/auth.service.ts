import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../models/Auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
        console.log(response);
      });
  }

  userLogin(email: string, password: string) {
    const auth: Auth = {email: email, password: password};
    this.httpService.post<{token: string}>('http://localhost:3000/api/auth/login', auth)
      .subscribe(response => { // storing token in the auth
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true); // allow for other components to check if user is logged in
          this.router.navigate(['/']);
        }
      });
  }
  userLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
