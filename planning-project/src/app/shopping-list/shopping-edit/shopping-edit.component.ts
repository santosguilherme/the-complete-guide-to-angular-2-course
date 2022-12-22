import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from '@ngrx/store';

import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formElement', {static: false})
  shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(state => {
      if (state.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = state.editedIngredient
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editMode = false;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
  }

  onSubmit(form: NgForm) {
    const formValues = form.value;
    const ingredient = new Ingredient(formValues.name, formValues.amount);

    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    } else {
      // this.shoppingListService.addIngredient(ingredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }

    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
  }

  onDelete() {
    // this.shoppingListService.removeIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
