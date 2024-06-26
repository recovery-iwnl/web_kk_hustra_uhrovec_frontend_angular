import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../services/userService/user.service";
import {trigger, state, style, animate, transition} from '@angular/animations';
import {map, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";

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
    ]),
    trigger('dropdownAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', animate('500ms ease-out')),
      transition('visible => hidden', animate('300ms ease-in'))
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

  isSticky: boolean = false;

  isDropdownVisible: boolean = false;

  role : any;

  constructor(private authService: AuthService, private router: Router, private userService: UserService,
              private cookie: CookieService) {
  }


  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    this.onScroll();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }


  @HostListener('window:scroll', ['$event'])
  onScroll(event?: any) {
    const headerHeight = document.querySelector('.header')?.clientHeight || 0;
    this.isSticky = window.pageYOffset > headerHeight;
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
    const token = this.cookie.get("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.role = tokenPayload.role;
      return tokenPayload.role === 'ADMIN';
    } else {
      return false;
    }
  }

  /**
   * Logs the user out by calling the logout method from the AuthService.
   */
  logout() {
    this.authService.logout();
    this.isDropdownVisible = false;
  }

  protected readonly localStorage = localStorage;
}
