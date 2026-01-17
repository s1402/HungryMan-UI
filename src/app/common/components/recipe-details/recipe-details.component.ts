import { SharedService } from 'src/app/services/shared.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageResponse, RecipeDetails, User } from '../../interfaces/User';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { MESSAGE } from '../../enums/CustomError';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  recipeDetails: RecipeDetails | null = null;
  ownerDetails: User | null = null;
  isFavorite = false;
  isRecipeViewed = false;
  showSnackBar = false;
  constructor(
    private readonly sharedService: SharedService,
    private readonly router: Router,
    private readonly recipeService: RecipeService,
    private readonly favoritesService: FavoritesService,
    private readonly authService: AuthService,
    protected readonly tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const routeStateRecipe = history.state?.recipe;
    if (routeStateRecipe) {
      this.recipeDetails = routeStateRecipe;
      this.isFavorite = this.isCurrentRecipeFavorite(routeStateRecipe._id);
      this.initializeRecipeData();
    } else {
      this.callFallBackApi();
    }
  }

  callFallBackApi(): void {
    const recipeId = this.router.url.split('/')[3];
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (response: RecipeDetails | null) => {
        if (response) {
          this.recipeDetails = response;
          this.sharedService.setRecipeDetails(this.recipeDetails);
          if (this.recipeDetails._id) {
            this.isFavorite = this.isCurrentRecipeFavorite(
              this.recipeDetails?._id || ''
            );
          }
          this.initializeRecipeData();
        } else {
          console.error('Recipe not found');
        }
      },
      error: (error: any) => {
        console.error('Error fetching recipe details:', error);
      },
    });
  }

  updateRecipeViewCount(): void {
    // if the recipe is already viewed , do nothing
    // if the recipe is not viewed , add foodie id in recipe views []
    this.recipeService
      .updateRecipeViewCount(this.recipeDetails?._id || '')
      .subscribe({
        next: (response: MESSAGE) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  isRecipeViewedByFoodie(views: string[]): boolean {
    return views.some(
      (foodieId: string) => foodieId === this.tokenService.getOwnerFoodieId()
    );
  }

  /**
   * Initializes recipe-related data when the recipe details are available.
   * - Checks if the current recipe has already been viewed by the logged-in foodie.
   * - Fetches the owner's information based on the recipe's `ownerId`.
   * - If the user is a foodie and the recipe hasn't been viewed yet, increments the view count.
   */
  initializeRecipeData(): void {
    if (this.recipeDetails) {
      this.isRecipeViewed = this.isRecipeViewedByFoodie(
        this.recipeDetails.views || []
      );
      this.fetchOwnerDetails(this.recipeDetails.ownerId || '');
      // if foodie is logged in and recipeDetails is not already viewed update recipe view count
      if (this.tokenService.isFoodieLoggedIn() && !this.isRecipeViewed) {
        this.updateRecipeViewCount();
      }
    }
  }

  fetchOwnerDetails(ownerId: string): void {
    this.authService.getOwnerById(ownerId).subscribe({
      next: (response) => {
        if (response) {
          this.ownerDetails = response;
        } else {
          console.error('Owner not found');
        }
      },
      error: (error: any) => {
        console.error('Error fetching Owner details:', error);
      },
    });
  }

  updateFavorites(): void {
    this.favoritesService
      .addFavorites(this.recipeDetails?._id || '')
      .subscribe({
        next: (messageResponse: MessageResponse) => {
          console.log(messageResponse);
          if (messageResponse) {
            let existingFavoriteIds = localStorage.getItem('favorites') || '[]';
            let existingFavoriteIdsArr: string[] =
              JSON.parse(existingFavoriteIds);

            // recipe is added to favorite
            if (!this.isFavorite) {
              if (existingFavoriteIds && this.recipeDetails) {
                // add recipe id in favorites localstorage
                existingFavoriteIdsArr.push(this.recipeDetails._id);
                localStorage.setItem(
                  'favorites',
                  JSON.stringify(existingFavoriteIdsArr)
                );
                this.recipeDetails.favoritesCount += 1;
              }
            } else {
              // recipe is removed from favorite
              if (existingFavoriteIds && this.recipeDetails) {
                let index = existingFavoriteIdsArr.findIndex(
                  (id: string) => id === this.recipeDetails?._id
                );

                // remove recipe from favorites in localstorage
                existingFavoriteIdsArr.splice(index, 1);

                localStorage.setItem(
                  'favorites',
                  JSON.stringify(existingFavoriteIdsArr)
                );
                this.recipeDetails.favoritesCount -= 1;
              }
            }

            this.isFavorite = !this.isFavorite;
            // show success banner
            this.showSnackBar = true;
            this.sharedService.showSnackBar({
              isSuccess: true,
              text: messageResponse.message,
            });
            setTimeout(() => {
              this.showSnackBar = false;
            }, 3000);
          } else {
            console.error('Failed to add recipe to favorites');
          }
        },
        error: (error: any) => {
          console.error('Error adding recipe to favorites:', error);
        },
      });
  }

  isCurrentRecipeFavorite(recipeId: string): boolean {
    const storedFavRecipeIds = localStorage.getItem('favorites');
    if (!storedFavRecipeIds) {
      return false;
    }
    try {
      const storedFavRecipeIdsArr: string[] = JSON.parse(storedFavRecipeIds);
      return storedFavRecipeIdsArr.some((id: string) => id === recipeId);
    } catch (error) {
      console.error('Error parsing the json', error);
      return false;
    }
  }

  ngOnDestroy(): void {
    this.sharedService.clearRecipeDetails();
    this.recipeDetails = null;
  }
}
