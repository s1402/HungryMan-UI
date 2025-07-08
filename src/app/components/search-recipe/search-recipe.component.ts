import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeDetails } from 'src/app/common/interfaces/User';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.scss']
})
export class SearchRecipeComponent {

  searchInput: string = '';
  showDropDown: boolean = false;
  recipes: RecipeDetails[] = [];

  constructor(private readonly recipeService: RecipeService, private readonly router: Router,private readonly sharedService: SharedService) { }

  onSearch(): void{
    this.searchInput = this.searchInput.trim();
    this.showDropDown = this.searchInput.length > 0;
    console.log("Searching for recipes with input:", this.searchInput);
    this.recipeService.searchRecipe(this.searchInput).subscribe({  
      next: (response: RecipeDetails[]) => {
        this.recipes = response;
        console.log("Search results:", this.recipes);
      },
      error: (error: any) => {
        console.error("Error fetching search results:", error);
        this.recipes = [];
      }
    });
  }

  onSelectRecipe(recipe: RecipeDetails): void { 
    console.log("Selected recipe:", recipe);
    this.searchInput = ""; 
    this.showDropDown = false; 
    // Navigate to the recipe details page
    this.router.navigate(['/recipe', recipe.title, recipe._id]);
    this.sharedService.setRecipeDetails(recipe);
  }
}
