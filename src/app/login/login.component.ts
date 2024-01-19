import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/userService/user.service";

/**
 * LoginComponent is an Angular component responsible for handling user login functionality.
 * It includes features such as form validation, user login, and error handling.
 *
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /**
   * Form group for user login containing email and password form controls.
   */
  loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    }
  );

  /**
   * Creates an instance of LoginComponent.
   *
   * @param http - Reference to the HttpClient for making HTTP requests.
   * @param router - Reference to the Router for navigation.
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param toastr - Reference to the ToastrService for displaying notifications.
   * @param userService - Reference to the UserService for managing user-related operations.
   */
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private toastr: ToastrService, private userService: UserService) {

  }

  /**
   * Checks if a user is currently logged in.
   */
  isLoggedIn = this.authService.isLoggedIn;

  /**
   * Handles the user login process.
   * Validates the login form, sends a login request to the server, and handles the response accordingly.
   */
  login() {
    if (this.loginForm.invalid) {
      this.toastr.error('', 'Nesprávne údaje!', {
        positionClass: 'toast-center-center',
      });
      return;
    }

    let data = {
      "email": this.loginForm.value.email,
      "password": this.loginForm.value.password
    };

    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);

    this.userService.loginUser(data).subscribe((resultData: any) => {
      console.log(resultData);
      if (resultData.message == "Email Doesn't Exist") {
        this.toastr.error('', 'Email neexistuje!', {
          positionClass: 'toast-center-center',
        });
      } else if (resultData.message == "Login Successful") {
        localStorage.setItem("token", <string>this.loginForm.value.email);
        localStorage.setItem("pass", <string>this.loginForm.value.password);
        this.authService.login();
        this.router.navigateByUrl('/domov');
      } else {
        this.toastr.error('', 'Nesprávne údaje!', {
          positionClass: 'toast-center-center',
        });
      }
    })
  }

  /**
   * Logs the user out by calling the logout method from the AuthService.
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Reference to the localStorage object for accessing local storage functionality.
   * @readonly
   */
  protected readonly localStorage = localStorage;
}
