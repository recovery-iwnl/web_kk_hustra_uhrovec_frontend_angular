import { Component } from '@angular/core';
import { UserService } from "../services/userService/user.service";
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  userDetails : any;

  constructor(private userService: UserService, private authService : AuthService) {
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

  deleteAccount() {
    const email = <string>localStorage.getItem("token");
    this.userService.deleteUser(email).pipe(
      tap((resp: any) => {
        console.log(resp);
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
    this.authService.logout();
  }
}
