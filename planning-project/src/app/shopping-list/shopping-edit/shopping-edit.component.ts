import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { Ingredient } from "../../shared/ingredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild('nameInput', {static: true})
  nameInputRef: ElementRef;

  @ViewChild('amountInput', {static: true})
  amountInputRef: ElementRef;
  @Output()
  ingredientAdded = new EventEmitter<Ingredient>();

  onAddItem() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = this.amountInputRef.nativeElement.value;

    this.ingredientAdded.emit(new Ingredient(name, amount));
  }
}
