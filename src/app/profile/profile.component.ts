import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/userService/user.service";
import {tap, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

/**
 * ProfileComponent is an Angular component responsible for managing user profile information.
 * It includes features such as retrieving user details, updating user information, and handling account deletion.
 *
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  /**
   * Represents the initial user details before any changes.
   */
  initialUserDetails: any = {};
  /**
   * Represents the error message for the username validation.
   */
  usernameErrorMessage: string | null = null;
  /**
   * Represents the error message for the email validation.
   */
  emailErrorMessage: string | null = null;
  /**
   * Represents the current user details.
   */
  userDetails: any = {};

  /**
   * Flag indicating whether there are changes made to the user profile.
   */
  isProfileChanged: boolean = false;

  passwordInput: string = '';

  passwordPlaceholder: string = '********';

  /**
   * Creates an instance of ProfileComponent.
   *
   * @param userService - Reference to the UserService for managing user-related operations.
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param dialog - Reference to the MatDialog service for displaying dialogs.
   */



  constructor(private userService: UserService, private authService: AuthService, private dialog: MatDialog) {
  }

  /**
   * Lifecycle hook that is called after the component is created.
   * Initializes the component by retrieving user details.
   */
  ngOnInit() {
    this.getDetails();
  }

  clearPassword() {
    this.passwordPlaceholder = '';
  }

  hidePassword() {
    if (!this.passwordInput) {
      this.passwordPlaceholder = '********';
    }
  }

  /**
   * Retrieves user details and initializes the 'initialUserDetails' property.
   */
  getDetails() {
    this.authService.getUserDetails(<string>localStorage.getItem("token")).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.userDetails = resp;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
    this.initialUserDetails = {...this.userDetails};
  }

  /**
   * Opens a confirmation dialog to confirm account deletion.
   * If the user confirms, deletes the user account and logs out.
   */
  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať svoj účet?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount();
      }
    });
  }

  /**
   * Deletes the user account, logs out the user, and redirects to the login page.
   */
  deleteAccount() {
    this.userService.deleteUser(this.userDetails.email).pipe(
      tap((resp: any) => {
        console.log("Account deleted");
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
    this.authService.logout();
  }

  /**
   * Updates the user information and handles validation errors.
   * Updates local storage with the new email and password.
   */
  updateUser() {
    this.userService.updateUser(this.userDetails).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.initialUserDetails = {...this.userDetails};
      }),
      catchError((err) => {
        console.log(err);

        if (typeof err === 'string') {

          if (err == "Email is already registered") {
            this.emailErrorMessage = "Účet s týmto emailom už existuje";
          } else if (err == "Username is already taken") {
            this.usernameErrorMessage = "Účet s týmto používateľským menom už existuje";
          }
        } else {
          this.emailErrorMessage = err.error?.email || 'Something went wrong.';
          this.usernameErrorMessage = err.error?.username || 'Something went wrong.';
        }
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Opens a confirmation dialog to confirm profile changes.
   * If the user confirms, updates the user profile.
   */
  confirmEdit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie',
        content: 'Naozaj chcete úložiť zmeny?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser();
      }
    });
  }

  /**
   * Checks if the username is invalid.
   *
   * @returns True if the username is invalid, false otherwise.
   */
  isUsernameInvalid(): boolean {
    return !this.userDetails.userName || this.userDetails.userName.length < 8;
  }

  /**
   * Checks if the email is invalid.
   *
   * @returns True if the email is invalid, false otherwise.
   */
  isEmailInvalid(): boolean {
    return !this.userDetails.email || !this.validateEmail(this.userDetails.email);
  }

  /**
   * Checks if the password is invalid.
   *
   * @returns True if the password is invalid, false otherwise.
   */
  isPasswordInvalid(): boolean {
    return !this.userDetails.password || this.userDetails.password.length < 8;
  }

  /**
   * Validates an email address.
   *
   * @param email - The email address to validate.
   * @returns True if the email is valid, false otherwise.
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  /**
   * Event handler for email change.
   * Clears the email error message and sets the 'isProfileChanged' flag to true.
   */
  onEmailChange() {
    this.emailErrorMessage = null;
    this.isProfileChanged = true;
  }

  /**
   * Event handler for username change.
   * Clears the username error message and sets the 'isProfileChanged' flag to true.
   */
  onUsernameChange() {
    this.usernameErrorMessage = null;
    this.isProfileChanged = true;
  }


  /**
   * Checks if there are changes made to the user profile.
   *
   * @returns True if there are changes made, false otherwise.
   */
  areChangesMade(): boolean {
    return JSON.stringify(this.userDetails) !== JSON.stringify(this.initialUserDetails);
  }

  /**
   * Event handler for password change.
   * Sets the 'isProfileChanged' flag to true.
   */
  onPasswordChange() {
    this.userDetails.password = this.passwordInput;
    this.isProfileChanged = true;
  }

  /**
   * Reference to the browser's local storage.
   */
  protected readonly localStorage = localStorage;
}
