import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/userService/user.service";
import {tap, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  initialUserDetails: any = {};
  usernameErrorMessage: string | null = null;
  emailErrorMessage: string | null = null;
  userDetails: any = {};

  isProfileChanged: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getDetails();
  }


  getDetails() {
    const email = <string>localStorage.getItem("token");
    this.userService.getUserDetails(email).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.userDetails = resp;
        this.userDetails.password = localStorage.getItem("pass");
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
    this.initialUserDetails = {...this.userDetails};
  }

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

  deleteAccount() {
    const email = <string>localStorage.getItem("token");
    this.userService.deleteUser(email).pipe(
      tap((resp: any) => {
        console.log("Accout deleted");
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
    this.authService.logout();
  }

  updateUser() {
    this.userService.updateUser(this.userDetails).pipe(
      tap((resp: any) => {
        console.log(resp);
        localStorage.setItem("token", this.userDetails.email);
        localStorage.setItem("pass", this.userDetails.password);
        //this.userDetails.password =  localStorage.getItem("pass");
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

  isUsernameInvalid(): boolean {
    return !this.userDetails.userName || this.userDetails.userName.length < 8;
  }

  isEmailInvalid(): boolean {
    return !this.userDetails.email || !this.validateEmail(this.userDetails.email);
  }

  isPasswordInvalid(): boolean {
    return !this.userDetails.password || this.userDetails.password.length < 8;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  onEmailChange() {
    this.emailErrorMessage = null;
    this.isProfileChanged = true;
  }

  onUsernameChange() {
    this.usernameErrorMessage = null;
    this.isProfileChanged = true;
  }

  areChangesMade(): boolean {
    return JSON.stringify(this.userDetails) !== JSON.stringify(this.initialUserDetails);
  }

  onPasswordChange() {
    this.isProfileChanged = true;
  }

  protected readonly localStorage = localStorage;
}
