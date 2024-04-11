import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";
import {CookieService} from "ngx-cookie-service";

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
   * @param config
   * @param cookie
   */
  constructor(private http : HttpClient, private config: ConfigService, private cookie: CookieService) { }


  public addLeagueYear(leagueYear: any) {
    const params = {leagueYear};
    console.log(params);
    return this.http.post(this.API + '/api/v1/leagueYear/save', null, { params,
      headers: {Authorization: `Bearer ${<string>this.cookie.get("token")}`}
    })
  }

  public updateLeagueYear(id: any, year: any) {
    const params = {id, year};
    return this.http.put(this.API + '/api/v1/leagueYear/update', params, { responseType:"text",
      params,
      headers: {Authorization: `Bearer ${<string>this.cookie.get("token")}`}
    })
  }

  public getAllYears() {
    return this.http.get(this.API+'/api/v1/leagueYear/getAll');
  }

}
