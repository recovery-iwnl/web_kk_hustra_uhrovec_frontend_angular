import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {ResultService} from "../services/resultService/result.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {AuthService} from "../services/auth/auth.service";
import {TeamService} from "../services/teamService/team.service";


@Component({
  selector: 'app-vysledky',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  selectedLeague: string = '1.KL Západ';

  results : any[] = [];

  result : any = {};

  teams : any[] = [];

  teamHome: any = {};

  playersHome : any[] = [];

  teamAway: any = {};

  playersAway : any[] = [];


  panelOpenState = false;
  constructor(private teamService: TeamService, private authService: AuthService, private resultService: ResultService, private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
  }


  ngOnInit(): void {
    this.getAllResults();
    this.getAllTeams();
  }




  getAllTeams() {
    this.teamService.getAllTeams().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.teams = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }


  updatePoints(result: any): void {
    this.ngZone.run(() => {
      for (let i = 1; i <= 6; i++) {
        const homeScore = result[`player${i}ScoreHome`] || 0;
        const awayScore = result[`player${i}ScoreAway`] || 0;

        if (homeScore > awayScore) {
          result[`player${i}PointsHome`] = 1;
          result[`player${i}PointsAway`] = 0;
        } else if (homeScore < awayScore) {
          result[`player${i}PointsHome`] = 0;
          result[`player${i}PointsAway`] = 1;
        } else {
          result[`player${i}PointsHome`] = 0.5;
          result[`player${i}PointsAway`] = 0.5;
        }
      }

      result.team1ScoreOverall = sumScores('player', 'ScoreHome', 6);
      result.team1PointsOverall = sumScores('player', 'PointsHome', 6);

      result.team2ScoreOverall = sumScores('player', 'ScoreAway', 6);
      result.team2PointsOverall = sumScores('player', 'PointsAway', 6);

      function sumScores(playerKey: string, scoreKey: string, playerCount: number): number {
        return Array.from({ length: playerCount }, (_, i) => result[`${playerKey}${i + 1}${scoreKey}`] || 0)
          .reduce((total, score) => total + parseFloat(score), 0);
      }

      if (result.team1ScoreOverall > result.team2ScoreOverall) {
        result.team1PointsOverall += 2;
      } else if (result.team1ScoreOverall < result.team2ScoreOverall) {
        result.team2PointsOverall += 2;
      }
    });
  }


  getPlayersByTeamHome(id :any) {
    this.teamService.getPlayersByTeam(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.playersHome = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getPlayersByTeamAway(id :any) {
    this.teamService.getPlayersByTeam(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.playersAway = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  onTeamHomeSelectionChange(selectedTeam: any) {
    this.teamHome = selectedTeam;
    console.log('Selected team for teamHome:', this.teamHome);
    this.getPlayersByTeamHome(this.teamHome.teamId);
  }

  onTeamAwaySelectionChange(selectedTeam: any) {
    this.teamAway = selectedTeam;
    console.log('Selected team for teamHome:', this.teamAway);
    this.getPlayersByTeamAway(this.teamAway.teamId);
  }

  getAllResults() {
    this.resultService.getAllResults().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.results = resp;
        this.results = this.results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  addResult() {
    //this.result.date = "09/09/2022";
    console.log(this.result);
    this.resultService.addResultSimple(this.teamHome.teamId,this.teamAway.teamId, this.result).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

  protected readonly console = console;
}
