import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { AuthService} from "../services/auth/auth.service";

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

  errorMessage: string | null = null;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {

  }
  login() {
    if(this.loginForm.invalid) {
      this.errorMessage = "Nesprávne údaje!";
      return;
    }

    let data = {
      "email" : this.loginForm.value.email,
      "password" : this.loginForm.value.password
    };

    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);

    this.http.post("http://localhost:8080/api/v1/user/login", data, {responseType: 'json'},).subscribe((resultData: any)=>
    {
      console.log(resultData);
      if (resultData.message == "Email Doesn't Exist") {
        this.errorMessage = "Email neexistuje";
      } else if (resultData.message == "Login Successful") {
        this.authService.login();
        this.router.navigateByUrl('/domov');
      } else {
        this.errorMessage = "Nesprávne údaje!";
      }

    })

  }
}
