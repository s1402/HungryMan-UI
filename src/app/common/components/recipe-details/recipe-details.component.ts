import { SharedService } from 'src/app/services/shared.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipeDetails, User } from '../../interfaces/User';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  recipeDetails: RecipeDetails | null = null;
  ownerDetails: User | null = null;
  constructor(
    private readonly sharedService: SharedService,
    private readonly router: Router,
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sharedService.recipeDetails$.subscribe(
      (recipeDetails: RecipeDetails | null) => {
        this.recipeDetails = recipeDetails;
        // If recipeDetails is already available, call owner API
        if (this.recipeDetails?.ownerId) {
          this.fetchOwnerDetails(this.recipeDetails.ownerId);
        }
      }
    );
    if (!this.recipeDetails) {
      // On refresh or null state, extract ID and fetch recipe
      const recipeId = this.router.url.split('/')[3];
      this.recipeService.getRecipeById(recipeId).subscribe({
        next: (response: RecipeDetails | null) => {
          if (response) {
            this.recipeDetails = response;
            this.sharedService.setRecipeDetails(this.recipeDetails);
            if (this.recipeDetails.ownerId) {
              this.fetchOwnerDetails(this.recipeDetails.ownerId);
            }
          } else {
            console.error('Recipe not found');
          }
        },
        error: (error: any) => {
          console.error('Error fetching recipe details:', error);
        },
      });
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

  ngOnDestroy(): void {
    this.sharedService.clearRecipeDetails();
    this.recipeDetails = null;
  }
}
