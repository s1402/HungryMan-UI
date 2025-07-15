import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RecipeDetails } from '../common/interfaces/User';
import { AuthService } from './auth.service';
import { MESSAGE } from '../common/enums/CustomError';
import { TokenService } from './token.service';

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
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  addRecipe(recipeData: FormData): Observable<Object> {
    return this.http
      .post<Object>(this.commonOwnerUrl, recipeData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  getAllRecipes(): Observable<Object> {
    return this.http
      .get<Object>(this.commonFoodieUrl, { headers: this.httpHeaders })
      .pipe(catchError((error) => throwError(() => error)));
  }

  getRecipeById(id: string): Observable<RecipeDetails | null> {
    return this.http
      .get<RecipeDetails | null>(this.commonFoodieUrl + '/' + id, {
        headers: this.httpHeaders,
      })
      .pipe(
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
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getRecipesByOwner(ownerId: string): Observable<RecipeDetails[]> {
    const url = `${this.commonOwnerUrl}?ownerId=${ownerId}`;
    return this.http
      .get<RecipeDetails[]>(url, { headers: this.httpHeaders })
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }

  updateRecipeViewCount(recipeId: string): Observable<MESSAGE> {
    const url = `${this.commonFoodieUrl}/views/${recipeId}`;
    return this.http
      .post<MESSAGE>(url, null, { headers: this.tokenService.getAuthHeaders() })
      .pipe(catchError((error) => throwError(() => error)));
  }
}
