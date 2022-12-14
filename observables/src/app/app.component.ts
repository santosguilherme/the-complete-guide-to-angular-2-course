import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "./user.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  userActivated = false;
  private activateSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.activateSubscription = this.userService.activatedEmitter.subscribe((value: boolean) => {
      this.userActivated = value;
    });
  }

  ngOnDestroy() {
    this.activateSubscription.unsubscribe();
  }
}
