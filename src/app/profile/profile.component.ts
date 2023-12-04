import { Component } from '@angular/core';
import { UserService } from "../services/userService/user.service";
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
  changesMade: boolean = false;

  userDetails : any = {};
  constructor(private userService: UserService, private authService : AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getDetails();
  }


  getDetails() {
    const email = <string>localStorage.getItem("token");
    this.userService.getUserDetails(email).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.userDetails = resp;
      }),
      catchError((err) => {
        console.log(err);

        return of(null);
      })
    ).subscribe();
    this.initialUserDetails = { ...this.userDetails };
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
    this.userService.updateUser(this.userDetails).pipe(tap((resp: any) => {
        console.log(resp);
        localStorage.setItem("token", this.userDetails.email);
        this.initialUserDetails = { ...this.userDetails };
        this.changesMade = false;
      }),
      catchError((err) => {
        console.log(err);
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
    return this.userDetails.userName && this.userDetails.userName.length < 8;
  }

  isEmailInvalid(): boolean {
    return !this.userDetails.email || !this.validateEmail(this.userDetails.email);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  areChangesMade(): boolean {
    return JSON.stringify(this.userDetails) !== JSON.stringify(this.initialUserDetails);
  }

}
