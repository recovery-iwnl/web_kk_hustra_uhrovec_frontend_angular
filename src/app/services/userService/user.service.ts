import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

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
  private API = "http://localhost:8080";

  /**
   * Creates an instance of UserService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }

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
   * Retrieves details of a user based on the specified email.
   *
   * @param email - The email of the user to be retrieved.
   * @returns An HTTP GET request to get the user by email.
   */
  public getUserDetails(email: string) {
    const params = { email };
    return this.http.get(this.API + '/api/v1/user/getUser', { params });
  }

  /**
   * Retrieves a list of all users.
   *
   * @returns An HTTP GET request to get the list of all users.
   */
  public getAllUsers() {
    return this.http.get(this.API + '/api/v1/user/getUsersList');
  }

  /**
   * Deletes a user based on the specified email.
   *
   * @param email - The email of the user to be deleted.
   * @returns An HTTP DELETE request to delete the user.
   */
  public deleteUser(email: any) {
    return this.http.delete(this.API + '/api/v1/user/deleteUser?email=' + email, {responseType: 'text'});
  }

  /**
   * Updates an existing user.
   *
   * @param user - The updated data of the user.
   * @returns An HTTP PUT request to update the user.
   */
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
