import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../common/interfaces/User';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private ownerUrl: string = 'http://localhost:5000/api/register/owner';
  private foodieUrl: string = 'http://localhost:5000/api/register/foodie';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(private readonly httpClient: HttpClient) {}

  register(user: User, isOwner = false): Observable<Object> {
    const url = isOwner ? this.ownerUrl : this.foodieUrl;
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
}
