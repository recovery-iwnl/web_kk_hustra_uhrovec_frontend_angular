import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public registerUser(userData : any) {
    return this.http.post(this.API + '/api/v1/user/save', userData, {responseType: 'text'})
  }

  public loginUser(userData : any) {
    return this.http.post(this.API + '/api/v1/user/login', userData, {responseType: 'json'})
  }

  public getUserDetails(userData : any) {
    return this.http.post(this.API + '/api/v1/user/getUser', userData, {responseType: 'json'})
  }
}
