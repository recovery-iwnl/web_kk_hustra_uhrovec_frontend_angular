import {Component, HostListener} from '@angular/core';
import {TokenExpirationService} from "./services/tokenExpiration/token-expiration.service";
import {AuthService} from "./services/auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebKKHustraUhrovec';

  constructor(private tokenExpiration: TokenExpirationService, private authService: AuthService,
              private toastr: ToastrService, private cookie: CookieService) {}

  ngOnInit() {
    const token = this.cookie.get("token");
    if (token) {
      this.tokenExpiration.checkTokenExpiration(token).subscribe(
        (isTokenInValid: boolean) => {
          if (!isTokenInValid) {
          } else {
            this.authService.logout();
            this.toastr.error(
              "Your session has expired. Please log in again.",
              "Session Expired",
              {
                positionClass: "toast-bottom-right",
              }
            );
          }
        });
    }
  }

}
