import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { RecipeDetails } from 'src/app/common/interfaces/User';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly router: Router,
    private readonly sharedService: SharedService
  ) {}

  recipes: RecipeDetails[] = [];
  isSearchActive: boolean = false;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    const stateSub = combineLatest([
      this.sharedService.isSearchActive$,
      this.sharedService.isFavoriteActive$,
    ]).subscribe(([searchActive, favoriteActive]) => {
      this.isSearchActive = searchActive;

      if (favoriteActive) {
        const favRecipes = localStorage.getItem('favorites') || '[]';
        this.recipes = JSON.parse(favRecipes);
      } else {
        this.recipeService.getAllRecipes().subscribe({
          next: (response: any) => {
            this.recipes = response;
            console.log('Recipes fetched successfully:', this.recipes);
          },
          error: (error: any) => {
            console.error('Error fetching recipes:', error);
          },
        });
      }
    });

    this.subscriptions.add(stateSub);
  }

  selectRecipe(recipe: RecipeDetails): void {
    this.router.navigate(['/recipe', recipe.title, recipe._id]);
    this.sharedService.setRecipeDetails(recipe);
  }

  onClickChevron(): void {
    // Toggle search active state
    this.isSearchActive = !this.isSearchActive;
    this.sharedService.setSearchActive(this.isSearchActive);
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Clear recipe details when the component is destroyed
    this.sharedService.clearRecipeDetails();
    // Reset search active state
    this.sharedService.setSearchActive(false);
    this.sharedService.setIsFavoriteActive(false);
    this.subscriptions.unsubscribe();
    this.isSearchActive = false;
  }
}
