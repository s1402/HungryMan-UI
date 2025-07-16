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
  isDataLoading = true;

  ngOnInit(): void {
    const stateSub = combineLatest([
      this.sharedService.isSearchActive$,
      this.sharedService.isFavoriteActive$,
      this.sharedService.isMyRecipesActive$,
    ]).subscribe(([searchActive, favoriteActive, myRecipesActive]) => {
      this.isSearchActive = searchActive;

      if (!this.isSearchActive) {
        // fetch all recipes if search is not active
        this.recipeService.getAllRecipes().subscribe({
          next: (response: any) => {
            this.recipes = response;
            this.isDataLoading = false;
            console.log('Recipes fetched successfully:', this.recipes);
            if (favoriteActive) {
              const favRecipeIds = localStorage.getItem('favorites') || '[]';
              const favRecipeIdArr: string[] = JSON.parse(favRecipeIds);
              const filteredRecipes: RecipeDetails[] = [];
              // Filter the fav recipes by logged in foodie
              this.recipes.forEach((recipeDetails: RecipeDetails) => {
                const isRecipeFav = favRecipeIdArr.includes(recipeDetails._id);
                if (isRecipeFav) {
                  filteredRecipes.push(recipeDetails);
                }
              });
              this.recipes = [...filteredRecipes];
              console.log(
                'Favorite Recipes fetched successfully:',
                this.recipes
              );
            } else if (myRecipesActive) {
              const myRecipeIds = localStorage.getItem('myRecipes') || '[]';
              const myRecipeIdArr: string[] = JSON.parse(myRecipeIds);
              const filteredRecipes: RecipeDetails[] = [];
              // Filter the recipes added by logged in owner
              this.recipes.forEach((recipeDetails: RecipeDetails) => {
                const isRecipeOwned = myRecipeIdArr.includes(recipeDetails._id);
                if (isRecipeOwned) {
                  filteredRecipes.push(recipeDetails);
                }
              });
              this.recipes = [...filteredRecipes];
              console.log('My Recipes fetched successfully:', this.recipes);
            }
          },
          error: (error: any) => {
            console.error('Error fetching recipes:', error);
            this.isDataLoading = false;
          },
        });
      }
    });

    this.subscriptions.add(stateSub);
  }

  selectRecipe(recipe: RecipeDetails): void {
    this.router.navigate(['/recipe', recipe.title, recipe._id], {
      state: { recipe },
    });
  }

  onClickChevron(): void {
    // Toggle search active state
    this.isSearchActive = !this.isSearchActive;
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Clear recipe details when the component is destroyed
    this.sharedService.clearRecipeDetails();
    // Reset search active state
    this.sharedService.setIsFavoriteActive(false);
    this.subscriptions.unsubscribe();
    this.isSearchActive = false;
    this.isDataLoading = false;
  }
}
