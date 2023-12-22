import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../services/userService/user.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {

  users: any[] = [];

  editedUser: any = {};

  constructor(private userService: UserService, private dialog: MatDialog, private authService: AuthService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.userService.getAllUsers().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.users = resp;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  editUser(user: any) {
    this.editedUser = { ...user };
  }

  updateUser() {
    this.userService.updateUser(this.editedUser).pipe(
      tap((resp: any) => {
        console.log(resp);
        const index = this.users.findIndex(u => u.userID === this.editedUser.userID);
        if (index !== -1) {
          this.users[index] = { ...this.editedUser };
        }
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }
  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  confirmDelete(user:any): void {
    this.editUser(user);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať uživateľa ' + this.editedUser.userName + ' ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount();
      }
    });
  }

  deleteAccount() {
    this.userService.deleteUser(this.editedUser.email).pipe(
      tap((resp: any) => {
        console.log("Account "+ this.editedUser.userName + " deleted");
        this.users = this.users.filter(u => u.userID !== this.editedUser.userID);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }
}
