import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { map, switchMap, take, of } from "rxjs";

import { Recipe } from "./recipe.model";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "./store/recipe.actions";

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store
      .select('recipes')
      .pipe(
        take(1),
        map(state => state.recipes),
        switchMap(recipes => {
          if (recipes.length === 0) {
            this.store.dispatch(new RecipesActions.FetchRecipes());

            return this.actions$.pipe(
              ofType(RecipesActions.SET_RECIPES),
              take(1)
            );
          }

          return of(recipes);
        })
      );
  }
}
