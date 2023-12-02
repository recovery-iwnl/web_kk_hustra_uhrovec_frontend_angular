import { Component } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/userService/user.service";

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

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private userService : UserService) {

  }

  register() {
    if(this.registerForm.invalid) {
      this.toastr.error('', 'Nesprávne údaje!', {
        positionClass: 'toast-center-center',
        timeOut: 1500,
        closeButton: true,
        progressBar: true
      });
      return;
    }

    let data = {
      "userName" : this.registerForm.value.userName,
      "email" : this.registerForm.value.email,
      "password" : this.registerForm.value.password


    };
    this.userService.registerUser(data).subscribe((resultData: any)=>
    {
      console.log(resultData);
      if (resultData == "Username is already taken") {
        this.toastr.error('', 'Uživateľ s týmto použivateľským menom už existuje!', {
          positionClass: 'toast-center-center',
          timeOut: 1500,
          closeButton: true,
          progressBar: true
        });
      } else if (resultData == "Email is already registered") {
        this.toastr.error('', 'Uživateľ s týmto emailom už existuje!', {
          positionClass: 'toast-center-center',
          timeOut: 1500,
          closeButton: true,
          progressBar: true
        });
      } else {
        this.showSuccess();
        this.router.navigateByUrl('/login')
      }

    })
  }

  showSuccess() {
    this.toastr.success('', 'Úspešne ste sa zaregistrovali!', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }

  protected readonly passwordMatchValidator = passwordMatchValidator;
}
