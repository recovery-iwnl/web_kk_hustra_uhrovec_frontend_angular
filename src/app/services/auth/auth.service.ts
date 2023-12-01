import {Injectable} from "@angular/core";
import {AuthGuard} from "../../auth.guard";

const AUTH_KEY = 'loggedIn';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;

  constructor() {
    this.loggedIn = localStorage.getItem(AUTH_KEY) === 'true';
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login() {
    this.loggedIn = true;
    localStorage.setItem(AUTH_KEY, 'true');
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem(AUTH_KEY);
  }
}
