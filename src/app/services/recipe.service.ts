import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private commonUrl: string = 'http://localhost:5000/api/owner/recipes';

  constructor(private readonly http: HttpClient) {}

  addRecipe(recipeData: FormData): Observable<Object> {
    return this.http.post(this.commonUrl, recipeData).pipe(
      map((response: any) => {
        if (response) {
          return true;
        }
        return false;
      }),
      catchError((error) => throwError(() => error))
    );
  }
}
