import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/userService/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router : Router, private userService: UserService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

  logout() {
    this.authService.logout();
  }

}
