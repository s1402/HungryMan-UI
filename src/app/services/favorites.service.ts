import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError, firstValueFrom } from 'rxjs';
import { MessageResponse, RecipeDetails } from '../common/interfaces/User';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  commonUrl = 'http://localhost:5000/api/recipes/favorites';
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  async getFavorites(): Promise<RecipeDetails[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<RecipeDetails[]>(this.commonUrl, {
          headers: this.getAuthHeaders(),
        })
      );
      return response || [];
    } catch (error) {
      console.error('Error fetching favorites list:', error);
      return [];
    }
  }

  addFavorites(recipeId: string): Observable<MessageResponse> {
    const url = `${this.commonUrl}/${recipeId}`;

    return this.http
      .post<MessageResponse[]>(url, {}, { headers: this.getAuthHeaders() })
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error adding recipe to favorites:', error);
          return throwError(() => error);
        })
      );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  }
}
