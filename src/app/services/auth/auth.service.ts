import {Injectable} from "@angular/core";
import {AuthGuard} from "../../auth.guard";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

const AUTH_KEY = 'loggedIn';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;

  constructor(private router : Router, private toastr : ToastrService) {
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
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem(AUTH_KEY);
    const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    this.toastr.success('', 'Úspešne ste sa odhlásili!', {
      positionClass: 'toast-bottom-right',
    });
  }
}
