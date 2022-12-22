import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import * as RecipesActions from "./recipe.actions";
import { Recipe } from "../recipe.model";
import * as fromApp from "../../store/app.reducer";

const API_BASE_URL = 'https://ng-complete-guide-3129d-default-rtdb.firebaseio.com/';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.httpClient.get<Recipe[]>(API_BASE_URL + '/recipes.json');
      }),
      map(recipes => {
        return recipes.map(recipe => ({
          ...recipe,
          ingredients: recipe.ingredients ?? []
        }));
      }),
      map(recipes => {
        return new RecipesActions.SetRecipes(recipes);
      })
    );
  });

  storeRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([action, state]) => {
        return this.httpClient
          .put(API_BASE_URL + '/recipes.json', state.recipes);
      })
    );
  }, {dispatch: false});

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromApp.AppState>) {
  }
}
