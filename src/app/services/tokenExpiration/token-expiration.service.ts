import {Injectable, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {interval, Observable, Subject, Subscription} from "rxjs";
import {ConfigService} from "../configService/config.service";

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService {

  private checkInterval: number = 60000; // Check every minute
  private subscription: Subscription | null = null;
  private tokenExpiredSubject: Subject<void> = new Subject<void>(); // Subject to emit token expiration events

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  startTokenCheck() {
    this.subscription = interval(this.checkInterval).subscribe(() => {

      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      this.checkTokenExpiration(token).subscribe(
        (isTokenInValid: boolean) => {
          if (!isTokenInValid) {
            console.log('Token is valid');
          } else {
            console.log('Token is expired');
            this.tokenExpiredSubject.next(); // Emit token expiration event
            this.toastr.error(
              "Your session has expired. Please log in again.",
              "Session Expired",
              {
                positionClass: "toast-bottom-right",
              }
            );
            this.router.navigateByUrl("/login");
          }
        },
        (error) => {
          console.error('Error checking token expiration:', error);
        }
      );
    });
  }

  stopTokenCheck() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkTokenExpiration(token: string): Observable<boolean> {
    return this.http.get<boolean>(this.config.apiUrl + '/api/v1/user/checkTokenExpiration', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Method to subscribe to token expiration events
  onTokenExpired(): Observable<void> {
    return this.tokenExpiredSubject.asObservable();
  }
}
