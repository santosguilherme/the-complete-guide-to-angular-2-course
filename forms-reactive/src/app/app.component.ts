import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  get controls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails)
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });

    this.signupForm.valueChanges.subscribe((value) => {
      console.log('valueChanges', value);
    });

    this.signupForm.statusChanges.subscribe((value) => {
      console.log('statusChanges', value);
    });

    this.signupForm.setValue({
      'userData': {
        'username': 'Guilherme',
        'email': 'sntguilherme@gmail.com'
      },
      'gender': 'male',
      'hobbies': []
    });

    this.signupForm.patchValue({
      'userData': {
        'username': 'santosguiii'
      }
    });
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (this.signupForm.get('hobbies') as FormArray).push(control);
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.includes(control.value)) {
      return {
        'nameIsForbidden': true
      };
    }
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({emailIsForbidden: true});
        } else {
          resolve(null);
        }
      }, 1500);
    });

    return promise;
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }
}
