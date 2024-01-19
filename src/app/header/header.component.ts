import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/userService/user.service";

/**
 * HeaderComponent is an Angular component responsible for displaying the header of the application.
 * It includes features such as checking user authentication status, determining if the user is an admin,
 * and providing a logout option.
 *
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  /**
   * Creates an instance of HeaderComponent.
   *
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param router - Reference to the Router for navigation.
   * @param userService - Reference to the UserService for managing user-related operations.
   */
  constructor(private authService: AuthService, private router : Router, private userService: UserService) {}

  /**
   * Checks if a user is currently logged in.
   *
   * @returns True if a user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  /**
   * Checks if the currently logged-in user has the 'ADMIN' role.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

  /**
   * Logs the user out by calling the logout method from the AuthService.
   */
  logout() {
    this.authService.logout();
  }

}
