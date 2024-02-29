import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {TeamService} from "../services/teamService/team.service";
import {PlayerService} from "../services/playerService/player.service";
import {LeagueYearService} from "../services/leagueYearService/league-year.service";
import {TeamResultService} from "../services/teamResultService/team-result.service";
import {PlayerResultService} from "../services/playerResultService/player-result.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit{

  teams: any[] = [];

  players: any[] = [];

  years: any[] = [];

  team1: any = {};

  team2: any = {};

  selectedYear: any = {};

  selectedCompare: any = {};


  constructor(private teamService: TeamService, private playerService: PlayerService,  private leagueYearService: LeagueYearService, private teamResultService: TeamResultService, private playerResultService : PlayerResultService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getAllTeams();
    this.getAllPlayers();
    this.getAllLeagueYears();
    this.selectedCompare = "Porovnaj Tímy";
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

  getAllPlayers() {
    this.playerService.getAllPlayers().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.players = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getAllLeagueYears() {
    this.leagueYearService.getAllYears().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.years = resp;
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
    } catch (e) {
    }
  }


  setSelectedCompare(text : any) {
    this.selectedCompare = text;
  }
}
