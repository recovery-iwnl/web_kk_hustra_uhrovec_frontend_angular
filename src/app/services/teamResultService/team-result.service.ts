import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";

@Injectable({
  providedIn: 'root'
})
export class TeamResultService {

  /**
   * API base URL for player-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of PlayerService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient, private config: ConfigService) { }

  public getAverage(id: any, leagueYearId : any) {
    const params = { id, leagueYearId };
    return this.http.get(this.API+'/api/v1/teamResult/getAverage',{ params } );
  }

  public getMatchesPlayed(id: any, leagueYearId : any) {
    const params = { id, leagueYearId };
    return this.http.get(this.API+'/api/v1/teamResult/getMatchesPlayed',{ params } );
  }

  public getMatchesWon(id: any, leagueYearId : any) {
    const params = { id, leagueYearId };
    return this.http.get(this.API+'/api/v1/teamResult/getMatchesWon',{ params } );
  }

  public getMatchesLost(id: any, leagueYearId : any) {
    const params = { id, leagueYearId };
    return this.http.get(this.API+'/api/v1/teamResult/getMatchesLost',{ params } );
  }

  public getMatchesDrawn(id: any, leagueYearId : any) {
    const params = { id, leagueYearId };
    return this.http.get(this.API+'/api/v1/teamResult/getMatchesDrawn',{ params } );
  }

  public getPoints(id: any, leagueYearId : any) {
    const params = { id, leagueYearId };
    return this.http.get(this.API+'/api/v1/teamResult/getPoints',{ params } );
  }
}
