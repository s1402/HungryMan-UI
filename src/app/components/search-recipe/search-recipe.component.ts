import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { RecipeDetails } from 'src/app/common/interfaces/User';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.scss'],
})
export class SearchRecipeComponent implements AfterViewInit {
  searchInput: string = '';
  showDropDown: boolean = false;
  recipes: RecipeDetails[] = [];
  @ViewChild('search')
  searchRef: ElementRef | null = null;

  constructor(
    private readonly recipeService: RecipeService,
    private readonly router: Router,
    private readonly sharedService: SharedService
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.searchRef?.nativeElement, 'input')
      .pipe(
        map((event: any) => event?.target?.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.searchInput = value;
        this.onSearch();
      });
  }

  onSearch(): void {
    this.searchInput = this.searchInput.trim();
    this.showDropDown = this.searchInput.length > 0;
    console.log('Searching for recipes with input:', this.searchInput);
    this.recipeService.searchRecipe(this.searchInput).subscribe({
      next: (response: RecipeDetails[]) => {
        this.recipes = response;
        console.log('Search results:', this.recipes);
      },
      error: (error: any) => {
        console.error('Error fetching search results:', error);
        this.recipes = [];
      },
    });
  }

  onSelectRecipe(recipe: RecipeDetails): void {
    console.log('Selected recipe:', recipe);
    this.searchInput = '';
    this.showDropDown = false;
    // Navigate to the recipe details page
    this.router.navigate(['/recipe', recipe.title, recipe._id]);
    this.sharedService.setRecipeDetails(recipe);
  }
}
