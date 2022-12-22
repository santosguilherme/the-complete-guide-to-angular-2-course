import { ActionReducerMap } from "@ngrx/store";

import { shoppingListReducer } from "../shopping-list/store/shopping-list.reducer";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import { authReducer } from "../auth/store/auth.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import { recipesReducer } from "../recipes/store/recipe.reducer";
import * as fromRecipes from "../recipes/store/recipe.reducer";

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
  recipes: recipesReducer
};
