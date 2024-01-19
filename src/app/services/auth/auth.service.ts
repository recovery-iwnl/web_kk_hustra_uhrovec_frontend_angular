import {Injectable} from "@angular/core";
import {AuthGuard} from "../../auth.guard";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../userService/user.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

/**
 * Represents the key for storing the authentication status in local storage.
 */
const AUTH_KEY = 'loggedIn';

/**
 * Represents the key for storing the user information in local storage.
 */
const USER_KEY = 'user';

/**
 * AuthService provides authentication-related functionalities such as login, logout,
 * and managing the logged-in user's information.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Indicates whether the user is currently logged in.
   */
  private loggedIn: boolean = false;

  /**
   * Represents the logged-in user.
   */
  loggedUser : any

  /**
   * Creates an instance of AuthService.
   *
   * @param router - Reference to the Angular Router for navigation.
   * @param toastr - Reference to the ToastrService for displaying notifications.
   * @param http - Reference to the HttpClient for making HTTP requests.
   * @param userService - Reference to the UserService for user-related operations.
   */
  constructor(private router : Router, private toastr : ToastrService, private http: HttpClient, private userService : UserService) {
    this.loggedIn = localStorage.getItem(AUTH_KEY) === 'true';
  }

  /**
   * Gets the current login status of the user.
   *
   * @returns True if the user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  /**
   * Performs a login operation and sets the user as logged in.
   */
  login() {
    this.loggedIn = true;
    localStorage.setItem(AUTH_KEY, 'true');
    this.toastr.success('', 'Úspešne ste sa prihlásili!', {
      positionClass: 'toast-bottom-right',
    });

    this.userService.getUserDetails(<string>localStorage.getItem("token")).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.loggedUser = resp;
        this.setLoggedInUser(this.loggedUser);
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Performs a logout operation and sets the user as logged out.
   */
  logout() {
    this.loggedIn = false;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("pass");
    const currentUrl = this.router.url;
      this.router.navigateByUrl('/domov');
    this.toastr.success('', 'Úspešne ste sa odhlásili!', {
      positionClass: 'toast-bottom-right',
    });
  }

  /**
   * Sets the logged-in user's information in local storage.
   *
   * @param user - The user information to be stored.
   */
  setLoggedInUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Retrieves the logged-in user's information from local storage.
   *
   * @returns The logged-in user's information or null if not available.
   */
  getLoggedInUser(): any {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
