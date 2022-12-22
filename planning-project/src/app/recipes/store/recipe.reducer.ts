import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipe.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipesReducer(state = initialState, action) {
  const {type} = action;

  if (type === RecipesActions.SET_RECIPES) {
    return {
      ...state,
      recipes: [...action.payload]
    };
  }

  if (type === RecipesActions.ADD_RECIPE) {
    return {
      ...state,
      recipes: [...state.recipes, action.payload]
    };
  }

  if (type === RecipesActions.UPDATE_RECIPE) {
    const recipe = state.recipes[action.payload.index];
    const updatedRecipe = {
      ...recipe,
      ...action.payload.recipe
    };

    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.payload.index] = updatedRecipe;

    return {
      ...state,
      recipes: updatedRecipes
    };
  }

  if (type === RecipesActions.DELETE_RECIPE) {
    return {
      ...state,
      recipes: state.recipes.filter((recipe, index) => index !== action.payload)
    };
  }

  return state;
}

