import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConfigService} from "../configService/config.service";

/**
 * Service for team-related operations, such as adding, fetching, updating, and deleting teams.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {


  /**
   * API base URL for team-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of TeamService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient, private config: ConfigService) { }

  /**
   * Retrieves a team based on the specified ID.
   *
   * @param id - The ID of the team to be retrieved.
   * @returns An HTTP GET request to get the team by ID.
   */

  public getTeamByName(name: any) {
    const params = { name };
    return this.http.get(this.API+'/api/v1/team/getTeamByName',{ params } );
  }

  /**
   * Retrieves a list of all teams.
   *
   * @returns An HTTP GET request to get the list of all teams.
   */
  public getAllTeams() {
    return this.http.get(this.API+'/api/v1/team/getTeamsList');
  }

  /**
   * Retrieves a list of players belonging to a specific team.
   *
   * @param id - The ID of the team to get players for.
   * @returns An HTTP GET request to get players by team ID.
   */
  public getPlayersByTeam(id: any) {
    const params = { id };
    return this.http.get(this.API + '/api/v1/team/playersByTeam', { params });
  }

  /**
   * Retrieves a list of players belonging to the team Uhrovec.
   *
   */
  public getPlayersUhrovec() {
    return this.http.get(this.API + '/api/v1/team/playersUhrovec');
  }
}
