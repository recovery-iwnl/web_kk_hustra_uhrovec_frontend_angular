import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

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

  public getUserDetails(email: string) {
    const params = { email };
    return this.http.get(this.API + '/api/v1/user/getUser', { params });
  }

  public getAllUsers() {
    return this.http.get(this.API + '/api/v1/user/getUsersList');
  }

  public deleteUser(email: any) {
    return this.http.delete(this.API + '/api/v1/user/deleteUser?email=' + email);
  }

  public updateUser(user: any): Observable<any> {
    return this.http.put(`${this.API}/api/v1/user/updateUser`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Update User Error:', error);

        if (error.status === 400) {
          return throwError(error.error);
        } else {
          return throwError('Something went wrong.');
        }
      })
    );
  }
}
