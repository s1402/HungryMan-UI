import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarDetails } from '../common/interfaces/Snackbar';
import { RecipeDetails } from '../common/interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private snackBarSubject: BehaviorSubject<SnackBarDetails> =
    new BehaviorSubject<SnackBarDetails>({ isSuccess: false, text: '' });
  private recipeDetails: BehaviorSubject<RecipeDetails | null> =
    new BehaviorSubject<RecipeDetails | null>(null);
  private isSearchActive: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isFavoriteActive: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isMyRecipesActive: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  snackBar$: Observable<SnackBarDetails> = this.snackBarSubject.asObservable();
  recipeDetails$: Observable<RecipeDetails | null> =
    this.recipeDetails.asObservable();
  isSearchActive$: Observable<boolean> = this.isSearchActive.asObservable();
  isFavoriteActive$: Observable<boolean> = this.isFavoriteActive.asObservable();
  isMyRecipesActive$: Observable<boolean> =
    this.isMyRecipesActive.asObservable();

  showSnackBar(snackBarDetails: SnackBarDetails): void {
    this.snackBarSubject.next(snackBarDetails);
  }

  setRecipeDetails(recipeDetails: RecipeDetails): void {
    this.recipeDetails.next(recipeDetails);
  }

  setSearchActive(isActive: boolean): void {
    this.isSearchActive.next(isActive);
  }

  setIsFavoriteActive(isActive: boolean): void {
    this.isFavoriteActive.next(isActive);
  }

  setIsMyRecipesActive(isActive: boolean): void {
    this.isMyRecipesActive.next(isActive);
  }

  clearRecipeDetails(): void {
    this.recipeDetails.next(null);
  }
}
