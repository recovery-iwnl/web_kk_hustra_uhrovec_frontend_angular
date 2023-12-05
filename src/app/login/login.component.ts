import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { AuthService} from "../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/userService/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
    }
  );


  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private toastr: ToastrService, private userService : UserService) {

  }

  isLoggedIn = this.authService.isLoggedIn;

  login() {
    if(this.loginForm.invalid) {
      this.toastr.error('', 'Login Failed!', {
        positionClass: 'toast-center-center',
      });
      return;
    }

    let data = {
      "email" : this.loginForm.value.email,
      "password" : this.loginForm.value.password
    };

    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);

    this.userService.loginUser(data).subscribe((resultData: any)=>
    {
      console.log(resultData);
      if (resultData.message == "Email Doesn't Exist") {
        this.toastr.error('', 'Email neexistuje!', {
          positionClass: 'toast-center-center',
        });
      } else if (resultData.message == "Login Successful") {
        this.authService.login();
        localStorage.setItem("token", <string>this.loginForm.value.email);
        localStorage.setItem("pass", <string>this.loginForm.value.password);
        this.router.navigateByUrl('/domov');
      } else {
        this.toastr.error('', 'Nesprávne údaje!', {
          positionClass: 'toast-center-center',
        });
      }
    })
  }

  logout() {
    this.authService.logout();
  }


  protected readonly localStorage = localStorage;
}
