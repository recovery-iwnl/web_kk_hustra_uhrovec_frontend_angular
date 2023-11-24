import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const passwordSame = control.get('passwordSame')?.value;

  return password === passwordSame ? null : { 'passwordMismatch': true };
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordSame: new FormControl('', [Validators.required]),
  }, { validators: passwordMatchValidator });

  register() {
    if(this.registerForm.invalid) {
      alert("Nesprávne údaje!")
      return;
    }
  }

  protected readonly passwordMatchValidator = passwordMatchValidator;
}
