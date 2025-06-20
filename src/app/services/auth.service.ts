import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../common/interfaces/User';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ownerRegisterUrl: string = 'http://localhost:5000/api/register/owner';
  private foodieRegisterUrl: string =
    'http://localhost:5000/api/register/foodie';
  private ownerLoginUrl: string = 'http://localhost:5000/api/login/owner';
  private foodieLoginUrl: string = 'http://localhost:5000/api/login/foodie';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(private readonly httpClient: HttpClient) {}

  register(user: User, isOwner = false): Observable<Object> {
    const url = isOwner ? this.ownerRegisterUrl : this.foodieRegisterUrl;
    return this.httpClient
      .post(url, JSON.stringify(user), { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response && response['message']) {
            return true;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  login(user: User, isOwner = false): Observable<Object> {
    const url = isOwner ? this.ownerLoginUrl : this.foodieLoginUrl;
    return this.httpClient
      .post(url, JSON.stringify(user), { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response && response['token']) {
            // add the token in local storage
            localStorage.setItem('token', response['token']);
            return true;
          }
          return false;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  logout(): void {
    localStorage.removeItem('token');
  }
}
