import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LeagueYearService {


  /**
   * API base URL for player-related operations.
   */
  private API = "http://localhost:8080";

  /**
   * Creates an instance of LeagueYearService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }

  public getAllYears() {
    return this.http.get(this.API+'/api/v1/leagueYear/getAll');
  }

}
