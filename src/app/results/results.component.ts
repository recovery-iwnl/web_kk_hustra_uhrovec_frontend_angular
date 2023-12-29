import {ChangeDetectorRef, Component} from '@angular/core';
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

  newResult : any = {};

  teams : any[] = [];

  teamHome: any = {};

  playersHome : any[] = [];

  teamAway: any = {};

  playersAway : any[] = [];


  panelOpenState = false;
  constructor(private teamService: TeamService, private authService: AuthService, private resultService: ResultService, private cdRef: ChangeDetectorRef) {
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

  addResult(teamIdHome : any, teamIdAway : any,
            player1IdHome : any, player2IdHome : any, player3IdHome : any, player4IdHome: any, player5IdHome : any, player6IdHome : any,
            player1IdAway : any, player2IdAway : any, player3IdAway : any, player4IdAway : any, player5IdAway : any, player6IdAway : any,) {
    this.resultService.addResult(teamIdHome,teamIdAway,player1IdHome,player2IdHome,player3IdHome,
      player4IdHome,player5IdHome,player6IdHome,player1IdAway,player2IdAway,player3IdAway,player4IdAway,player5IdAway,player6IdAway,this.newResult).pipe(
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
