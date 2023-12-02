import { Component } from '@angular/core';
import {UserService} from "../services/userService/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {


  constructor(private userService : UserService) {

  }
}
