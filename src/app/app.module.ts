import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackBarComponent } from './common/components/snack-bar/snack-bar.component';
import { HomeComponent } from './components/home/home.component';
import { AddRecipeComponent } from './components/owner/add-recipe/add-recipe.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './common/components/header/header.component';
import { MatRadioModule } from '@angular/material/radio';
import { RecipeDetailsComponent } from './common/components/recipe-details/recipe-details.component';
import { SearchRecipeComponent } from './components/search-recipe/search-recipe.component';
import { AboutComponent } from './components/about/about.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    SnackBarComponent,
    HomeComponent,
    AddRecipeComponent,
    HeaderComponent,
    RecipeDetailsComponent,
    SearchRecipeComponent,
    AboutComponent,
    CapitalizePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    /* Import TranslateModule with HttpLoaderFactory for translation support
     This will load translation files from the specified path
     The files should be named as <lang>-lang.json, e.g., en-lang.json, fr-lang.json, etc.
     The path '../assets/i18n/' is relative to the `src` folder
     and '-lang.json' is the suffix for the translation */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '-lang.json');
}
