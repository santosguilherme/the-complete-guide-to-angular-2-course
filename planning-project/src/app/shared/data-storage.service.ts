import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs";

const API_BASE_URL = 'https://ng-complete-guide-3129d-default-rtdb.firebaseio.com/';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService) {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.httpClient
      .put(API_BASE_URL + '/recipes.json', recipes)
      .subscribe(response => {
        console.log('Store recipes', response);
      });
  }

  fetchRecipes() {
    return this.httpClient
      .get<Recipe[]>(API_BASE_URL + '/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients ?? []
          }));
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
