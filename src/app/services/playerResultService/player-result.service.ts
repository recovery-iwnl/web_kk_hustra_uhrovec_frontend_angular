import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlayerResultService {

  /**
   * API base URL for player-related operations.
   */
  private API = "http://localhost:8080";

  /**
   * Creates an instance of PlayerResultService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }

  public getAverage(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getAverage',{ params } );
  }

  public getMatchesPlayed(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getMatchesPlayed',{ params } );
  }

  public getPlayersBest(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getPlayersBest',{ params } );
  }
}
