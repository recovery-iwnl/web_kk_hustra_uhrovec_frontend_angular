import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";

@Injectable({
  providedIn: 'root'
})
export class LeagueYearService {


  /**
   * API base URL for player-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of LeagueYearService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient, private config: ConfigService) { }

  public getAllYears() {
    return this.http.get(this.API+'/api/v1/leagueYear/getAll');
  }

}
