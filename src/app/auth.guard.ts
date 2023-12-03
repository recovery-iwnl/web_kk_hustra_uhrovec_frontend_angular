// auth.guard.ts
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./services/auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(state.url);
  }

  checkAuth(url: string): boolean {

    if (this.authService.isLoggedIn) {
      if (url === '/register') {
        this.router.navigate(['/login']);
        return false;
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

