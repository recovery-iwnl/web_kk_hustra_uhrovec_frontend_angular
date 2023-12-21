import { Component, OnInit  } from '@angular/core';
import {UserService} from "../services/userService/user.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {

  users: any[] = [];

  editedUser: any = {};

  constructor(private userService: UserService) {
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
      (window as any).ngRef.detectChanges();
    } catch (e) {}
  }
}
