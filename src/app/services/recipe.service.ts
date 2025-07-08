import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RecipeDetails } from '../common/interfaces/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private commonOwnerUrl: string = 'http://localhost:5000/api/owner/recipes';
  private commonFoodieUrl: string = 'http://localhost:5000/api/recipes';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(
    private readonly http: HttpClient
  ) {}

  addRecipe(recipeData: FormData): Observable<Object> {
    return this.http.post(this.commonOwnerUrl, recipeData).pipe(
      map((response: any) => {
        if (response) {
          return true;
        }
        return false;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  getAllRecipes(): Observable<Object> {
    return this.http
      .get(this.commonFoodieUrl, { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          }
          return [];
        }),
        catchError((error) => throwError(() => error))
      );
  }

  getRecipeById(id: string): Observable<RecipeDetails | null> {
    return this.http
      .get(this.commonFoodieUrl + '/' + id, { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error fetching recipe by ID:', error);
          return throwError(() => error);
        })
      );
  }

  searchRecipe(searchInput: string): Observable<RecipeDetails[]> {
    const url = `${this.commonFoodieUrl}/search?q=${encodeURIComponent(
      searchInput
    )}`;
    return this.http
      .get<RecipeDetails[]>(url, { headers: this.httpHeaders })
      .pipe(
        map((response: any) => {
          if (response && Array.isArray(response)) {
            return response;
          }
          return [];
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
