import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./services/auth/auth.service";

/**
 * Guard that checks whether a user is authenticated and has the required role to access a route.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  /**
   * Creates an instance of AuthGuard.
   *
   * @param authService - The authentication service.
   * @param router - The Angular router service.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether the route can be activated.
   *
   * @param route - The route to be activated.
   * @param state - The router state snapshot.
   * @returns A boolean indicating whether the route can be activated.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(state.url);
  }

  /**
   * Checks the authentication status and role of the user.
   *
   * @param url - The URL of the route.
   * @returns A boolean indicating whether the user is authenticated and has the required role.
   */
  checkAuth(url: string): boolean {

    if (this.authService.isLoggedIn) {
      if (url === '/register') {
        this.router.navigate(['/login']);
        return false;
      }
      const token = localStorage.getItem("token");
      if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (url == '/users' && tokenPayload.role != 'ADMIN') {
          this.router.navigate(['/domov']);
          return false;
        }
      } else {
        console.error("Token is null. User is not authenticated.");
        this.router.navigate(['/login']);
      }

      return true;
    } else {
      if (url === '/register') {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }

}

