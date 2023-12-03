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

  userDetails : any;
  constructor(private userService: UserService, private authService : AuthService, private dialog: MatDialog) {
    this.getDetails()
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
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Yes"
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
}
