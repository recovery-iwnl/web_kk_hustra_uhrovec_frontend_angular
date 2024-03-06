import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/userService/user.service";
import {trigger, state, style, animate, transition} from '@angular/animations';
import {filter} from "rxjs";

/**
 * HeaderComponent is an Angular component responsible for displaying the header of the application.
 * It includes features such as checking user authentication status, determining if the user is an admin,
 * and providing a logout option.
 *
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('jumpOut', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('jump', style({
        transform: 'scale(1.1)'
      })),
      transition('normal <=> jump', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]

})
export class HeaderComponent implements OnInit {

  /**
   * Creates an instance of HeaderComponent.
   *
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param router - Reference to the Router for navigation.
   * @param userService - Reference to the UserService for managing user-related operations.
   */

  animationState: any = {};

  currentRoute: any;


  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  /**
   * Checks if a user is currently logged in.
   *
   * @returns True if a user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  jump() {
    this.animationState = 'jump';
    setTimeout(() => {
      this.animationState = 'normal';
    }, 300); // Adjust the timeout to match the animation duration
  }

  onMouseEnter(item: string) {
    this.animationState[item] = 'jump';
  }

  onMouseLeave(item: string) {
    this.animationState[item] = 'normal';
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

  protected readonly localStorage = localStorage;
}
