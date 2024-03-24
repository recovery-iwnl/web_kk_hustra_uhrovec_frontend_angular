import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ConfigService} from "../configService/config.service";

/**
 * Service for user-related operations, such as registration, login, fetching, updating, and deleting users.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * API base URL for user-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of UserService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient, private config: ConfigService) { }

  /**
   * Registers a new user.
   *
   * @param userData - The data of the user to be registered.
   * @returns An HTTP POST request to register the user.
   */
  public registerUser(userData : any) {
    return this.http.post(this.API + '/api/v1/user/save', userData, {responseType: 'text'})
  }

  /**
   * Logs in a user.
   *
   * @param userData - The data of the user for login.
   * @returns An HTTP POST request to log in the user.
   */
  public loginUser(userData : any) {
    return this.http.post(this.API + '/api/v1/user/login', userData, {responseType: 'json'})
  }

  /**
   * Retrieves a list of all users.
   *
   * @returns An HTTP GET request to get the list of all users.
   */
  public getAllUsers() {
    return this.http.get(this.API + '/api/v1/user/getUsersList');
  }

  public getNewestUser() {
    return this.http.get(this.API + '/api/v1/user/getNewestUser', {responseType: "text"});
  }

  public getNumberOfUsers() {
    return this.http.get(this.API + '/api/v1/user/getNumberOfUsers', {responseType: "text"});
  }


  /**
   * Deletes a user based on the specified id.
   *
   * @param id - The id of the user to be deleted.
   * @returns An HTTP DELETE request to delete the user.
   */
  public deleteUser(id: any) {
    return this.http.delete(this.API + '/api/v1/user/deleteUser?id=' + id, {responseType: 'text'});
  }

  /**
   * Updates an existing user.
   *
   * @param user - The updated data of the user.
   * @returns An HTTP PUT request to update the user.
   */
  public updateUser(user: any): Observable<any> {
    return this.http.put(`${this.API}/api/v1/user/updateUser`, user,  {responseType: "text"})
  }

  /**
   * Updates the role of an existing user.
   *
   * @param id - The ID of the user whose role needs to be updated.
   * @param role - The new role to be assigned.
   * @returns An HTTP PUT request to update the user's role.
   */
  public updateUserRole(id : any, role :any): Observable<any> {
    const params = { id, role};
    const url = `${this.API}/api/v1/user/updateUserRole?id=${id}&role=${role}`;
    return this.http.put(url, { params });
  }
}
