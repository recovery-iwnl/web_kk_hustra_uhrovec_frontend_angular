import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {TeamService} from "../services/teamService/team.service";
import {PlayerService} from "../services/playerService/player.service";
import {LeagueYearService} from "../services/leagueYearService/league-year.service";
import {TeamResultService} from "../services/teamResultService/team-result.service";
import {PlayerResultService} from "../services/playerResultService/player-result.service";
import {catchError, tap} from "rxjs/operators";
import {forkJoin, Observable, of} from "rxjs";


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
      yValueFormatString: "#,###.##'%'",
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
      horizontalAlign: "right",
      verticalAlign: "center"
    },
    data: [{
      type: "pie",
      showInLegend: true,
      yValueFormatString: "#,###.##'%'",
      dataPoints: [
        { y: 0, name: "Výhry", color: "#9BBB58" },
        { y: 0, name: "Remízy", color: "#F79647" },
        { y: 0, name: "Prehry", color: "#C0504E" }
      ]
    }]
  };

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
      this.playerResultService.getPlayersBest(playerId, yearId),
      this.playerResultService.getAverage(playerId, yearId),
      this.playerService.getAge(playerId),
      this.playerService.getTeamNameByPlayer(playerId),
    ]).pipe(
      tap(([matchesPlayed, playerBest, average, age, teamName ]) => {
        this.player1Object = { // Assign fetched statistics to team1Object
          teamName,
          matchesPlayed,
          playerBest,
          average,
          age
        };
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  updateTeam1ChartData() {
    const matchesPlayed = this.team1Object.matchesPlayed;

    if (matchesPlayed > 0) {
      const matchesWonPercentage = (this.team1Object.matchesWon / matchesPlayed) * 100;
      const matchesDrawnPercentage = (this.team1Object.matchesDrawn / matchesPlayed) * 100;
      const matchesLostPercentage = (this.team1Object.matchesLost / matchesPlayed) * 100;

      this.chartTeam1.data[0].dataPoints = [
        { y: matchesWonPercentage, name: "Výhry", color: "#9BBB58" },
        { y: matchesDrawnPercentage, name: "Remízy", color: "#F79647" },
        { y: matchesLostPercentage, name: "Prehry", color: "#C0504E" }
      ];

      this.showChartTeam1 = true;
    } else {
      this.showChartTeam1 = false;
    }
  }

  updateTeam2ChartData() {
    const matchesPlayed = this.team2Object.matchesPlayed;

    if (matchesPlayed > 0) {
      const matchesWonPercentage = (this.team2Object.matchesWon / matchesPlayed) * 100;
      const matchesDrawnPercentage = (this.team2Object.matchesDrawn / matchesPlayed) * 100;
      const matchesLostPercentage = (this.team2Object.matchesLost / matchesPlayed) * 100;

      this.chartTeam2.data[0].dataPoints = [
        { y: matchesWonPercentage, name: "Výhry", color: "#9BBB58" },
        { y: matchesDrawnPercentage, name: "Remízy", color: "#F79647" },
        { y: matchesLostPercentage, name: "Prehry", color: "#C0504E" }
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

  fetchPlayer2Statistics(playerId: any, yearId: any): Observable<any> {
    return forkJoin([
      this.playerResultService.getMatchesPlayed(playerId, yearId),
      this.playerResultService.getPlayersBest(playerId, yearId),
      this.playerResultService.getAverage(playerId, yearId),
      this.playerService.getAge(playerId),
      this.playerService.getTeamNameByPlayer(playerId),
    ]).pipe(
      tap(([matchesPlayed, playerBest, average, age, teamName ]) => {
        this.player2Object = { // Assign fetched statistics to team1Object
          teamName,
          matchesPlayed,
          playerBest,
          average,
          age
        };
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
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
        this.fetchTeam1Statistics(teamId, selectedYearId).subscribe(); // Fetch statistics for the selected team
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
        this.fetchTeam2Statistics(teamId, selectedYearId).subscribe(); // Fetch statistics for the selected team
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }


  getPlayer1StatisticsByName(name: any) {
    const selectedYearId = this.selectedYear1.yearId;
    const [firstName, lastName] = name.split(' '); // Split name into first name and last name
    console.log(firstName, lastName);
    this.playerService.getPlayerByName(firstName, lastName).pipe(
      tap((resp: any) => {
        console.log(resp);
        const playerId = resp.playerID;
        this.fetchPlayer1Statistics(playerId, selectedYearId).subscribe(); // Fetch statistics for the selected team
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getPlayer2StatisticsByName(name: any) {
    const selectedYearId = this.selectedYear2.yearId;
    const [firstName, lastName] = name.split(' '); // Split name into first name and last name
    this.playerService.getPlayerByName(firstName, lastName).pipe(
      tap((resp: any) => {
        console.log(resp);
        const playerId = resp.playerID;
        this.fetchPlayer2Statistics(playerId, selectedYearId).subscribe(); // Fetch statistics for the selected team
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
