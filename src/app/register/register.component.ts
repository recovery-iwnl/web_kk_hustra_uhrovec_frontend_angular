import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/userService/user.service";
import {AuthService} from "../services/auth/auth.service";

/**
 * Custom validator function for checking if password and password confirmation match.
 *
 * @param control - The form group control containing password and password confirmation.
 * @returns Null if passwords match, an error object otherwise.
 */
function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const passwordSame = control.get('passwordSame')?.value;

  return password === passwordSame ? null : {'passwordMismatch': true};
}

/**
 * RegisterComponent is an Angular component responsible for user registration.
 * It includes a registration form with validation for username, email, and password.
 *
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /**
   * Represents the registration form with controls for username, email, password, and password confirmation.
   */
  registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordSame: new FormControl('', [Validators.required]),
  }, {validators: passwordMatchValidator});

  /**
   * Creates an instance of RegisterComponent.
   *
   * @param http - Reference to the HttpClient for making HTTP requests.
   * @param router - Reference to the Router for navigation.
   * @param toastr - Reference to the ToastrService for displaying notifications.
   * @param userService - Reference to the UserService for managing user-related operations.
   * @param authService - Reference to the AuthService for handling user authentication.
   */
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private userService: UserService, private authService: AuthService) {}


  /**
   * Initiates the user registration process.
   * Validates the registration form and sends registration data to the server.
   * Displays success message upon successful registration.
   */
  register() {
    if (this.registerForm.invalid) {
      this.toastr.error('', 'Nesprávne údaje!', {
        positionClass: 'toast-center-center',
        timeOut: 1500,
        closeButton: true,
        progressBar: true
      });
      return;
    }

    let data = {
      "userName": this.registerForm.value.userName,
      "email": this.registerForm.value.email,
      "password": this.registerForm.value.password


    };
    this.userService.registerUser(data).subscribe((resultData: any) => {
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

  /**
   * Displays a success notification upon successful user registration.
   */
  showSuccess() {
    this.toastr.success('', 'Úspešne ste sa zaregistrovali!', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }


  /**
   * Reference to the passwordMatchValidator function for validating password confirmation.
   */
  protected readonly passwordMatchValidator = passwordMatchValidator;
}
