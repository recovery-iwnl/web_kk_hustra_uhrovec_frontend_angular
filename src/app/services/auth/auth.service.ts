import {Injectable} from "@angular/core";
import {AuthGuard} from "../../auth.guard";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../userService/user.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

const AUTH_KEY = 'loggedIn';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;

  loggedUser : any

  constructor(private router : Router, private toastr : ToastrService, private http: HttpClient, private userService : UserService) {
    this.loggedIn = localStorage.getItem(AUTH_KEY) === 'true';
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

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

  setLoggedInUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getLoggedInUser(): any {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
