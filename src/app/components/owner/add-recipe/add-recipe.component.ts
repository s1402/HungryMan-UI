import { RecipeService } from './../../../services/recipe.service';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthService } from 'src/app/services/auth.service';
import { CustomError } from 'src/app/common/enums/CustomError';
import { SharedService } from 'src/app/services/shared.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  showSnackBar = false;
  readonly separatorKeysCodes = [ENTER, COMMA];
  maxValue = 10;
  maxTagValue = 5;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
    private readonly tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      ingredients: this.fb.array([], Validators.required),
      steps: this.fb.array([this.fb.control('', Validators.required)]),
      tags: this.fb.array([], Validators.required),
      vegetarian: [false]
    });
  }

  addChip(
    value: string,
    formArray: FormArray,
    maxValue: number,
    event: MatChipInputEvent
  ) {
    if (value && formArray.length < maxValue) {
      // if length< max, add the ingredient formControl in ingredients formArray
      formArray.push(new FormControl(value));
    }

    // clearing the input field
    if (event.chipInput.inputElement) {
      event.chipInput.inputElement.value = '';
    }
    this.cdr.detectChanges();
  }

  addIngredient(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.addChip(value, this.ingredients, this.maxValue, event);
  }

  removeIngredient(index: number): void {
    if (index >= 0) {
      this.ingredients.removeAt(index);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.addChip(value, this.tags, this.maxTagValue, event);
  }

  removeTag(index: number): void {
    if (index >= 0) {
      this.tags.removeAt(index);
    }
  }

  addStep(): void {
    if (this.steps.length < this.maxValue) {
      this.steps.push(new FormControl('', Validators.required));
    }
  }

  removeStep(index: number): void {
    this.steps.removeAt(index);
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // to avoid form submit on hitting enter
  @HostListener('document:keydown.enter', ['$event'])
  onKeyboardNavigation(event: KeyboardEvent): void {
    event.preventDefault();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title.value);
    formData.append('description', this.description.value);
    formData.append('ingredients', JSON.stringify(this.ingredients.value));
    formData.append('steps', JSON.stringify(this.steps.value));
    formData.append('tags', JSON.stringify(this.tags.value));
    formData.append('ownerId', this.tokenService.getOwnerFoodieId());
    formData.append('vegetarian', this.vegetarian.value.toString());

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    // call your API service to send this formData
    this.recipeService.addRecipe(formData).subscribe({
      next: (response) => {
        console.log('Recipe added successfully', response);
        this.showSnackBar = true; // Show success message
        this.sharedService.showSnackBar({
          isSuccess: true,
          text: 'Recipe Added Successfully!',
        });
        setTimeout(() => {
          this.form.reset(); // Reset the form after successful submission
          this.imagePreview = null; // Reset image preview
          this.imageFile = null; // Reset image file
          this.showSnackBar = false;
          this.vegetarian.setValue(false); // Reset vegetarian toggle
          this.tags.clear(); // Clear tags
          this.ingredients.clear(); // Clear ingredients
          this.steps.clear(); // Clear steps
          this.steps.push(this.fb.control('', Validators.required)); // Add a default step
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (response) => {
        this.showSnackBar = true;
        if (response && response.error && response.error['error']) {
          this.form.setErrors(response.error['error']);
          this.sharedService.showSnackBar({
            isSuccess: false,
            text: response.error['error'],
          });
        } else {
          this.form.setErrors({ error: CustomError.SERVER_IS_DOWN });
          this.sharedService.showSnackBar({
            isSuccess: false,
            text: CustomError.SERVER_IS_DOWN,
          });
        }
        setTimeout(() => {
          this.showSnackBar = false;
        }, 3000);
      },
    });
  }

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.form.get('steps') as FormArray;
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  get vegetarian(): FormControl {
    return this.form.get('vegetarian') as FormControl;
  }

  getStepsFormControl(): FormControl[] {
    return this.steps.controls as FormControl[];
  }
}
