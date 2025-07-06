import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarDetails } from '../common/interfaces/Snackbar';
import { RecipeDetails } from '../common/interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private snackBarSubject: BehaviorSubject<SnackBarDetails> = new BehaviorSubject<SnackBarDetails>({ isSuccess: false , text: ''});
  private recipeDetails: BehaviorSubject<RecipeDetails|null> = new BehaviorSubject<RecipeDetails|null>(null);

  snackBar$: Observable<SnackBarDetails> = this.snackBarSubject.asObservable();
  recipeDetails$: Observable<RecipeDetails|null> = this.recipeDetails.asObservable();

  showSnackBar(snackBarDetails: SnackBarDetails): void{ 
    this.snackBarSubject.next(snackBarDetails);
  }

  setRecipeDetails(recipeDetails: RecipeDetails): void {
    this.recipeDetails.next(recipeDetails);
  }

  getRecipeDetails(): RecipeDetails|null {
    return this.recipeDetails.getValue();
  }

  clearRecipeDetails(): void {
    this.recipeDetails.next(null);
  }
}
