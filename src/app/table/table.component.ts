import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TeamService} from "../services/teamService/team.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {TeamResultService} from "../services/teamResultService/team-result.service";

/**
 * Component representing a table view of teams with statistics.
 *
 */
@Component({
  selector: 'app-tabulka',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  /**
   * The selected league for which teams are displayed.
   */
  selectedLeague: string = "1.KL Západ";

  /**
   * Array to store team data for the table.
   */
  teams : any [] = [];

  /**
   * Column headers for the table.
   */
  columns: string[] = ['#', 'Klub', 'Záp', 'V', 'R', 'P', 'Priemer', 'Body']

  matchesPlayed: any;

  /**
   * Creates an instance of TableComponent.
   *
   * @param teamService - The service to fetch team data.
   * @param cdRef - The ChangeDetectorRef for manual change detection.
   */
  constructor(private teamService: TeamService, private teamResultService: TeamResultService, private cdRef: ChangeDetectorRef) {
  }

  /**
   * Lifecycle hook called after construction and after the first ngOnChanges().
   */
  ngOnInit(): void {
    this.getAllTeams()
  }


  /**
   * Fetches all teams for the selected league.
   */
  getAllTeams() {
    this.teamService.getAllTeams().pipe(
      tap((resp: any) => {
        this.teams = resp;
        // Fetch additional data for each team
        this.teams.forEach((team, index) => {
          this.fetchTeamStatistics(team.teamId, index);
        });
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  fetchTeamStatistics(teamId: any, index: number) {
    this.teamResultService.getMatchesPlayed(teamId).subscribe(matchesPlayed => {
      this.teams[index].matchesPlayed = matchesPlayed;
    });
    this.teamResultService.getMatchesWon(teamId).subscribe(matchesWon => {
      this.teams[index].matchesWon = matchesWon;
    });
    this.teamResultService.getMatchesLost(teamId).subscribe(matchesLost => {
      this.teams[index].matchesLost = matchesLost;
    });
    this.teamResultService.getMatchesDrawn(teamId).subscribe(matchesDrawn => {
      this.teams[index].matchesDrawn = matchesDrawn;
    });
    this.teamResultService.getAverage(teamId).subscribe(average => {
      this.teams[index].average = average;
    });
    this.teamResultService.getPoints(teamId).subscribe(points => {
      this.teams[index].points = points;
    });
  }

  /**
   * Performs manual change detection.
   */
  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }


  /**
   * Changes the selected league for displaying teams.
   *
   * @param league - The league to switch to.
   */
  changeTable(league: string) {
    this.selectedLeague = league;
  }


}
