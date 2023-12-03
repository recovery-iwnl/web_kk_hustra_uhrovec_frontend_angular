import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router : Router) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logout() {
    this.authService.logout();
  }

  refreshPage() {
    const currentUrl = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
