import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}

const initialState: State = {
  ingredients: [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
  const {type} = action;

  if (type === ShoppingListActions.ADD_INGREDIENT) {
    return {
      ...state,
      ingredients: [...state.ingredients, action.payload]
    };
  }

  if (type === ShoppingListActions.ADD_INGREDIENTS) {
    return {
      ...state,
      ingredients: [...state.ingredients, ...action.payload]
    };
  }

  if (type === ShoppingListActions.UPDATE_INGREDIENT) {
    const oldIngredient = state.ingredients[state.editedIngredientIndex];
    const updatedIngredient = {
      ...oldIngredient,
      ...action.payload
    };

    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

    return {
      ...state,
      ingredients: updatedIngredients,
      editedIngredientIndex: -1,
      editedIngredient: null
    };
  }

  if (type === ShoppingListActions.DELETE_INGREDIENT) {
    return {
      ...state,
      ingredients: state.ingredients.filter((value, index) => index !== state.editedIngredientIndex),
      editedIngredientIndex: -1,
      editedIngredient: null
    };
  }

  if (type === ShoppingListActions.START_EDIT_INGREDIENT) {
    return {
      ...state,
      editedIngredient: {...state.ingredients[action.payload]},
      editedIngredientIndex: action.payload
    };
  }

  if (type === ShoppingListActions.STOP_EDIT_INGREDIENT) {
    return {
      ...state,
      editedIngredient: null,
      editedIngredientIndex: -1
    };
  }

  return state;
}
