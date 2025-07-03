import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private readonly recipeService: RecipeService) {

  }

  recipes: any[] = [];

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (response: any) => {
        this.recipes = response;
        console.log('Recipes fetched successfully:', response);
      },
      error: (error: any) => {
        console.error('Error fetching recipes:', error);
      }
    })
  }
}
