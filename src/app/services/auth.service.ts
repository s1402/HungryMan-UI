import { FavoritesService } from 'src/app/services/favorites.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeDetails, User } from '../common/interfaces/User';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { TokenService } from './token.service';
import { RecipeService } from './recipe.service';

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

  constructor(
    private readonly httpClient: HttpClient,
    private readonly favoriteService: FavoritesService,
    private readonly recipeService: RecipeService,
    private readonly tokenService: TokenService
  ) {}

  register(user: FormData, isOwner = false): Observable<Object> {
    const url = isOwner ? this.ownerRegisterUrl : this.foodieRegisterUrl;
    return this.httpClient.post(url, user).pipe(
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
        switchMap((response: any) => {
          if (response && response['token']) {
            // add the token in local storage
            localStorage.setItem('token', response['token']);
            // if its a foodie , add favorite recipe's IdS in local storage
            if (!isOwner) {
              return from(this.favoriteService.getFavorites()).pipe(
                switchMap((favorites: RecipeDetails[]) => {
                  let favRecipeIds: string[] = [];
                  favorites.forEach((favorite: RecipeDetails) => {
                    favRecipeIds.push(favorite._id);
                  }) 
                  localStorage.setItem('favorites', JSON.stringify(favRecipeIds));
                  return of(true);
                }),
                catchError((error) => {
                  localStorage.setItem('favorites', JSON.stringify([]));
                  return of(true);
                })
              );
            } else {
              // if its a owner , add recipes by owner in local storage
              const ownerId = this.tokenService.getOwnerId();
              return this.recipeService.getRecipesByOwner(ownerId).pipe(
                switchMap((recipes: RecipeDetails[]) => {
                  let myRecipeIds: string[] = [];
                  recipes.forEach((recipe: RecipeDetails) => {
                    myRecipeIds.push(recipe._id);
                  }) 
                  localStorage.setItem('myRecipes', JSON.stringify(myRecipeIds));
                  return of(true);
                }),
                catchError(() => {
                  localStorage.setItem('myRecipes', JSON.stringify([]));
                  return of(true);
                })
              );
            }
          }
          return of(false);
        }),
        catchError((error) => throwError(() => error))
      );
  }

  getOwnerById(ownerId: string): Observable<User> {
    const url = `http://localhost:5000/api/login/${ownerId}`;
    return this.httpClient.get(url, { headers: this.httpHeaders }).pipe(
      map((response: any) => {
        if (response) {
          return response;
        }
        return null;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  logout(): void {
    const isOwner = this.tokenService.isOwnerLoggedIn();
    localStorage.removeItem('token');
    // if its a foodie , remove favorites from local storage
    if (!isOwner) {
      localStorage.removeItem('favorites');
    } else {
      localStorage.removeItem('myRecipes');
    }
  }
}
