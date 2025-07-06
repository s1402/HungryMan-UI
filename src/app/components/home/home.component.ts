import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeDetails } from 'src/app/common/interfaces/User';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private readonly recipeService: RecipeService, private readonly router: Router,private readonly sharedService: SharedService) { 

  }

  recipes: RecipeDetails[] = [];

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (response: any) => {
        this.recipes = response;
        console.log('Recipes fetched successfully:', this.recipes);
      },
      error: (error: any) => {
        console.error('Error fetching recipes:', error);
      }
    })
  }

  selectRecipe(recipe: RecipeDetails): void {
    console.log(">>",recipe);
    this.router.navigate(['/recipe', recipe.title, recipe._id]);
    this.sharedService.setRecipeDetails(recipe);
  }
}
