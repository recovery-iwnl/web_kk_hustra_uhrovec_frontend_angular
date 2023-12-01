import { Component } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";


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

  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {

  }

  register() {
    if(this.registerForm.invalid) {
      this.errorMessage = "Nesprávne údaje!";
      return;
    }

    let data = {
      "userName" : this.registerForm.value.userName,
      "email" : this.registerForm.value.email,
      "password" : this.registerForm.value.password


    };
    this.http.post("http://localhost:8080/api/v1/user/save", data, {responseType: 'text'},).subscribe((resultData: any)=>
    {
      console.log(resultData);
      if (resultData == "Username is already taken") {
        this.errorMessage = "Uživateľ s týmto použivateľským menom už existuje";
      } else if (resultData == "Email is already registered") {
        this.errorMessage = "Uživateľ s týmto emailom už existuje";
      } else {
        this.errorMessage = "Úspešne ste sa zaregistrovali";
        this.router.navigateByUrl('/login')
      }

    })
  }

  protected readonly passwordMatchValidator = passwordMatchValidator;
}
