import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";

@Injectable({
  providedIn: 'root'
})
export class PlayerResultService {

  /**
   * API base URL for player-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of PlayerResultService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient, private config: ConfigService) { }

  public getAverage(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getAverage',{ params } );
  }

  public getMatchesPlayed(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getMatchesPlayed',{ params } );
  }

  public getDuelsWon(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getDuelsWon',{ params } );
  }

  public getDuelsDrawn(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getDuelsDrawn',{ params } );
  }

  public getDuelsLost(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getDuelsLost',{ params } );
  }

  public getPlayersBest(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getPlayersBest',{ params } );
  }

  public getPlayersWorst(id: any, leagueYearId : any) {
    const params = { id, leagueYearId  };
    return this.http.get(this.API+'/api/v1/playerResult/getPlayersWorst',{ params } );
  }
}
