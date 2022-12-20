import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";

import { AuthResponseData, AuthService } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false})
  alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;


  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    const {email, password} = authForm.value;

    let authObservable: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(response => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
      this.showErrorAlert(errorMessage);
    });

    authForm.reset();
  }

  onAlertClose() {
    this.error = null;
  }

  private showErrorAlert(msg: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    alertComponentRef.instance.message = msg;
    this.closeSubscription = alertComponentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
