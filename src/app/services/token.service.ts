import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isUserLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  isOwnerLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      // payload is the 2nd part of the JWT token , atob decodes base64 i.e ASCII to binary and JSON.parse converts it to object
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'owner';
    }
    return false;
  }

  isFoodieLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      // payload is the 2nd part of the JWT token , atob decodes base64 i.e ASCII to binary and JSON.parse converts it to object
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'foodie';
    }
    return false;
  }

  getOwnerFoodieId(): string {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id;
    }
    return '';
  }

  getLoggedInUserName(): string {
    const token = this.getToken()
    if(!token){
      return '';
    }
    return JSON.parse(atob(token.split('.')[1])).name as string;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  }
}
