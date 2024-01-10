import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {ResultService} from "../services/resultService/result.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {AuthService} from "../services/auth/auth.service";
import {TeamService} from "../services/teamService/team.service";
import {DatePipe} from "@angular/common";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";


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

  dateShow : any = {};

  constructor(private datePipe: DatePipe, private teamService: TeamService,private dialog: MatDialog, private authService: AuthService, private resultService: ResultService, private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
  }


  ngOnInit(): void {
    this.getAllResults();
    this.getAllTeams();
  }

  deleteResult(result : any) {
    this.resultService.deleteResult(result.resultId).pipe(
      tap((resp: any) => {
        this.results = this.results.filter(r => r.resultId !== result.resultId);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  confirmDelete(event: Event,resultN:any): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať výsledok ' + resultN.teamHome.teamName + ' vs ' + resultN.teamAway.teamName + ' ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteResult(resultN);
      }
    });
  }


  onDateSelected(selectedDate: Date): void {
    this.result.date = this.formatDate(selectedDate);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }


  isFormValid(): boolean {
    const playerScores = [
      this.result.player1ScoreHome,
      this.result.player2ScoreHome,
      this.result.player3ScoreHome,
      this.result.player4ScoreHome,
      this.result.player5ScoreHome,
      this.result.player6ScoreHome,

      this.result.player1ScoreAway,
      this.result.player2ScoreAway,
      this.result.player3ScoreAway,
      this.result.player4ScoreAway,
      this.result.player5ScoreAway,
      this.result.player6ScoreAway,
    ];

    const players = [
      this.result.player1Home,
      this.result.player2Home,
      this.result.player3Home,
      this.result.player4Home,
      this.result.player5Home,
      this.result.player6Home,

      this.result.player1Away,
      this.result.player2Away,
      this.result.player3Away,
      this.result.player4Away,
      this.result.player5Away,
      this.result.player6Away,
    ];

    return playerScores.every(score => score !== undefined && score !== '') &&
      players.every(player => player !== undefined && player !== '') && this.result.date !== undefined && this.result.date !== '';
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
        this.results.push(resp);
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
