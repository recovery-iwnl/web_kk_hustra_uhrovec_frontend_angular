import {Injectable} from "@angular/core";
import {AuthGuard} from "../../auth.guard";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../userService/user.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {ConfigService} from "../configService/config.service";

/**
 * Represents the key for storing the authentication status in local storage.
 */
const AUTH_KEY = 'loggedIn';

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
   * Creates an instance of AuthService.
   *
   * @param router - Reference to the Angular Router for navigation.
   * @param toastr - Reference to the ToastrService for displaying notifications.
   * @param http - Reference to the HttpClient for making HTTP requests.
   * @param userService - Reference to the UserService for user-related operations.
   */
  constructor(private router : Router, private toastr : ToastrService, private http: HttpClient, private userService : UserService, private config: ConfigService) {
    this.loggedIn = !!localStorage.getItem("token");
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
    this.toastr.success('', 'Úspešne ste sa prihlásili!', {
      positionClass: 'toast-bottom-right',
    });
  }

  getUserDetails(token: string) {
    return this.http.get(this.config.apiUrl + '/api/v1/user/getUserDetails', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Performs a logout operation and sets the user as logged out.
   */
  logout() {
    this.loggedIn = false;
    localStorage.removeItem("token");
      this.router.navigateByUrl('/domov');
    this.toastr.success('', 'Úspešne ste sa odhlásili!', {
      positionClass: 'toast-bottom-right',
    });
  }
}
