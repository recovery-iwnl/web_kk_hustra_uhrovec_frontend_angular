import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {TeamService} from "../services/teamService/team.service";
import {PlayerService} from "../services/playerService/player.service";
import {LeagueYearService} from "../services/leagueYearService/league-year.service";
import {TeamResultService} from "../services/teamResultService/team-result.service";
import {PlayerResultService} from "../services/playerResultService/player-result.service";
import {catchError, tap} from "rxjs/operators";
import {forkJoin, Observable, of} from "rxjs";
/**
 * Component responsible for comparing teams and players.
 */
@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  teams: any[] = [];

  players: any[] = [];

  years: any[] = [];

  team1: string = '';

  team2: string = '';

  team1Object: any = {};

  team2Object: any = {};

  player1: string = '';

  player2: string = '';

  player1Object: any = {};

  player2Object: any = {};

  selectedYear1: any = {};

  selectedYear2: any = {};

  selectedCompare: any = {};

  showChartTeam1: boolean = false;

  showChartTeam2: boolean = false;

  showChartPlayer1: boolean = false;

  showChartPlayer2: boolean = false;


  constructor(
    private teamService: TeamService,
    private playerService: PlayerService,
    private leagueYearService: LeagueYearService,
    private teamResultService: TeamResultService,
    private playerResultService: PlayerResultService,
    private cdRef: ChangeDetectorRef) {
  }

  chartTeam1 = {
    animationEnabled: true,
    legend: {
      horizontalAlign: "right",
      verticalAlign: "center"
    },
    data: [{
      type: "pie",
      showInLegend: true,
      startAngle: -90,
      toolTipContent: "{name}: ({y}) #percent %",
      yValueFormatString: "#,###.##",
      dataPoints: [
        { y: 0, name: "Výhry", color: "#9BBB58" },
        { y: 0, name: "Remízy", color: "#F79647" },
        { y: 0, name: "Prehry", color: "#C0504E" }
      ]
    }]
  };

  chartTeam2 = {
    animationEnabled: true,
    legend: {
      horizontalAlign: "left",
      verticalAlign: "center"
    },
    data: [{
      type: "pie",
      showInLegend: true,
      startAngle: -90,
      toolTipContent: "{name}: ({y}) #percent %",
      yValueFormatString: "#,###.##",
      dataPoints: [
        { y: 0, name: "Výhry", color: "#9BBB58" },
        { y: 0, name: "Remízy", color: "#F79647" },
        { y: 0, name: "Prehry", color: "#C0504E" }
      ]
    }]
  };

  chartPlayer1 = {
    animationEnabled: true,
    legend: {
      horizontalAlign: "right",
      verticalAlign: "center"
    },
    data: [{
      type: "doughnut",
      showInLegend: true,
      startAngle: -90,
      toolTipContent: "{name}: ({y}) #percent %",
      yValueFormatString: "#,###.##",
      dataPoints: [
        { y: 0, name: "Výhry", color: "#9BBB58" },
        { y: 0, name: "Remízy", color: "#F79647" },
        { y: 0, name: "Prehry", color: "#C0504E" }
      ]
    }]
  };

  chartPlayer2 = {
    animationEnabled: true,
    legend: {
      horizontalAlign: "left",
      verticalAlign: "center"
    },
    data: [{
      type: "doughnut",
      showInLegend: true,
      startAngle: -90,
      toolTipContent: "{name}: ({y}) #percent %",
      yValueFormatString: "#,###.##",
      dataPoints: [
        { y: 0, name: "Výhry", color: "#9BBB58" },
        { y: 0, name: "Remízy", color: "#F79647" },
        { y: 0, name: "Prehry", color: "#C0504E" }
      ]
    }]
  };

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.getAllTeams();
    this.getAllPlayers();
    this.getAllLeagueYears();
    this.getAllYears();
    this.selectedCompare = "Porovnaj Tímy";
    this.detectChanges();
  }

  getAllYears() {
    this.leagueYearService.getAllYears().pipe(
      tap((resp: any) => {
        this.years = resp;
        this.selectedYear1 = this.years[0];
        this.selectedYear2 = this.years[0];
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe(() => {
      this.getAllTeams();
    });
  }

  setSelectedYear1(year: any) {
    this.selectedYear1 = year;
  }

  setSelectedYear2(year: any) {
    this.selectedYear2 = year;
  }

  fetchTeam1Statistics(teamId: any, yearId: any): Observable<any> {
    return forkJoin([
      this.teamResultService.getMatchesPlayed(teamId, yearId),
      this.teamResultService.getMatchesWon(teamId, yearId),
      this.teamResultService.getMatchesLost(teamId, yearId),
      this.teamResultService.getMatchesDrawn(teamId, yearId),
      this.teamResultService.getAverage(teamId, yearId),
      this.teamResultService.getPoints(teamId, yearId)
    ]).pipe(
      tap(([matchesPlayed, matchesWon, matchesLost, matchesDrawn, average, points]) => {
        this.team1Object = {
          matchesPlayed,
          matchesWon,
          matchesLost,
          matchesDrawn,
          average,
          points
        };
        this.updateTeam1ChartData();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  fetchTeam2Statistics(teamId: any, yearId: any): Observable<any> {
    return forkJoin([
      this.teamResultService.getMatchesPlayed(teamId, yearId),
      this.teamResultService.getMatchesWon(teamId, yearId),
      this.teamResultService.getMatchesLost(teamId, yearId),
      this.teamResultService.getMatchesDrawn(teamId, yearId),
      this.teamResultService.getAverage(teamId, yearId),
      this.teamResultService.getPoints(teamId, yearId)
    ]).pipe(
      tap(([matchesPlayed, matchesWon, matchesLost, matchesDrawn, average, points]) => {
        this.team2Object = {
          matchesPlayed,
          matchesWon,
          matchesLost,
          matchesDrawn,
          average,
          points
        };
        this.updateTeam2ChartData();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  fetchPlayer1Statistics(playerId: any, yearId: any): Observable<any> {
    return forkJoin([
      this.playerResultService.getMatchesPlayed(playerId, yearId),
      this.playerResultService.getDuelsWon(playerId, yearId),
      this.playerResultService.getDuelsDrawn(playerId, yearId),
      this.playerResultService.getDuelsLost(playerId, yearId),
      this.playerResultService.getPlayersBest(playerId, yearId),
      this.playerResultService.getPlayersWorst(playerId, yearId),
      this.playerResultService.getAverage(playerId, yearId),
      this.playerService.getAge(playerId),
      this.playerService.getTeamNameByPlayer(playerId),
    ]).pipe(
      tap(([matchesPlayed, duelsWon, duelsDrawn, duelsLost, playerBest, playerWorst, average, age, teamName ]) => {
        this.player1Object = {
          teamName,
          matchesPlayed,
          duelsWon,
          duelsDrawn,
          duelsLost,
          playerBest,
          playerWorst,
          average,
          age
        };
        this.updatePlayer1ChartData();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  fetchPlayer2Statistics(playerId: any, yearId: any): Observable<any> {
    return forkJoin([
      this.playerResultService.getMatchesPlayed(playerId, yearId),
      this.playerResultService.getDuelsWon(playerId, yearId),
      this.playerResultService.getDuelsDrawn(playerId, yearId),
      this.playerResultService.getDuelsLost(playerId, yearId),
      this.playerResultService.getPlayersBest(playerId, yearId),
      this.playerResultService.getPlayersWorst(playerId, yearId),
      this.playerResultService.getAverage(playerId, yearId),
      this.playerService.getAge(playerId),
      this.playerService.getTeamNameByPlayer(playerId),
    ]).pipe(
      tap(([matchesPlayed, duelsWon, duelsDrawn, duelsLost, playerBest, playerWorst, average, age, teamName ]) => {
        this.player2Object = {
          teamName,
          matchesPlayed,
          duelsWon,
          duelsDrawn,
          duelsLost,
          playerBest,
          playerWorst,
          average,
          age
        };
        this.updatePlayer2ChartData();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  updateTeam1ChartData() {
    if (this.team1Object.matchesPlayed > 0) {
      this.chartTeam1.data[0].dataPoints = [
        { y: this.team1Object.matchesWon, name: "Výhry", color: "#9BBB58" },
        { y: this.team1Object.matchesDrawn, name: "Remízy", color: "#F79647" },
        { y: this.team1Object.matchesLost, name: "Prehry", color: "#C0504E" }
      ];

      this.showChartTeam1 = true;
    } else {
      this.showChartTeam1 = false;
    }
  }

  updateTeam2ChartData() {
    if (this.team2Object.matchesPlayed > 0) {
      this.chartTeam2.data[0].dataPoints = [
        { y: this.team2Object.matchesWon, name: "Výhry", color: "#9BBB58" },
        { y: this.team2Object.matchesDrawn, name: "Remízy", color: "#F79647" },
        { y: this.team2Object.matchesLost, name: "Prehry", color: "#C0504E" }
      ];

      this.showChartTeam2 = true;
    } else {
      this.showChartTeam2 = false;
    }
  }

  hideChartTeam1() {
    this.showChartTeam1 = false;
  }

  hideChartTeam2() {
    this.showChartTeam2 = false;
  }

  updatePlayer1ChartData() {
    if (this.player1Object.matchesPlayed > 0) {

      this.chartPlayer1.data[0].dataPoints = [
        { y: this.player1Object.duelsWon, name: "Výhry", color: "#9BBB58" },
        { y: this.player1Object.duelsDrawn, name: "Remízy", color: "#F79647" },
        { y: this.player1Object.duelsLost, name: "Prehry", color: "#C0504E" }
      ];

      this.showChartPlayer1 = true;
    } else {
      this.showChartPlayer1 = false;
    }
  }

  updatePlayer2ChartData() {
    if (this.player2Object.matchesPlayed > 0) {

      this.chartPlayer2.data[0].dataPoints = [
        { y: this.player2Object.duelsWon, name: "Výhry", color: "#9BBB58" },
        { y: this.player2Object.duelsDrawn, name: "Remízy", color: "#F79647" },
        { y: this.player2Object.duelsLost, name: "Prehry", color: "#C0504E" }
      ];

      this.showChartPlayer2 = true;
    } else {
      this.showChartPlayer2 = false;
    }
  }

  hideChartPlayer1() {
    this.showChartPlayer1 = false;
  }

  hideChartPlayer2() {
    this.showChartPlayer2 = false;
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

  getTeam1StatisticsByName(name: any) {
    const selectedYearId = this.selectedYear1.yearId;
    this.teamService.getTeamByName(name).pipe(
      tap((resp: any) => {
        console.log(resp);
        const teamId = resp.teamId;
        this.fetchTeam1Statistics(teamId, selectedYearId).subscribe();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getTeam2StatisticsByName(name: any) {
    const selectedYearId = this.selectedYear2.yearId;
    this.teamService.getTeamByName(name).pipe(
      tap((resp: any) => {
        console.log(resp);
        const teamId = resp.teamId;
        this.fetchTeam2Statistics(teamId, selectedYearId).subscribe();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getPlayer1StatisticsByName(name: any) {
    const selectedYearId = this.selectedYear1.yearId;
    const [firstName, lastName] = name.split(' ');
    console.log(firstName, lastName);
    this.playerService.getPlayerByName(firstName, lastName).pipe(
      tap((resp: any) => {
        console.log(resp);
        const playerId = resp.playerID;
        this.fetchPlayer1Statistics(playerId, selectedYearId).subscribe();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getPlayer2StatisticsByName(name: any) {
    const selectedYearId = this.selectedYear2.yearId;
    const [firstName, lastName] = name.split(' ');
    this.playerService.getPlayerByName(firstName, lastName).pipe(
      tap((resp: any) => {
        console.log(resp);
        const playerId = resp.playerID;
        this.fetchPlayer2Statistics(playerId, selectedYearId).subscribe();
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
  setSelectedCompare(text: any) {
    this.selectedCompare = text;
  }
}
