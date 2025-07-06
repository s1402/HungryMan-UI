import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AddRecipeComponent } from './components/owner/add-recipe/add-recipe.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnerGuard } from './guards/owner.guard';
import { RecipeDetailsComponent } from './common/components/recipe-details/recipe-details.component';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
  },
  {
    component: RegisterComponent,
    path: 'register',
  },
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    component: AddRecipeComponent,
    path: 'owner/add-recipe',
    canActivate: [AuthGuard, OwnerGuard],
  },
  {
    component: RecipeDetailsComponent,
    path: 'recipe/:title/:id',
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
