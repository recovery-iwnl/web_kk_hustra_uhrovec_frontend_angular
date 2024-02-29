import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TeamService } from "../services/teamService/team.service";
import { catchError, tap } from "rxjs/operators";
import { Observable, of, forkJoin} from "rxjs";
import { TeamResultService } from "../services/teamResultService/team-result.service";
import { LeagueYearService } from "../services/leagueYearService/league-year.service";

@Component({
  selector: 'app-tabulka',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  teams: any[] = [];
  columns: string[] = ['#', 'Klub', 'Záp', 'V', 'R', 'P', 'Priemer', 'Body'];
  matchesPlayed: any;
  years: any[] = [];
  selectedYear: any = {};

  constructor(
    private teamService: TeamService,
    private leagueYearService: LeagueYearService,
    private teamResultService: TeamResultService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllYears();
  }

  getAllYears() {
    this.leagueYearService.getAllYears().pipe(
      tap((resp: any) => {
        this.years = resp;
        this.selectedYear = this.years[0];
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe(() => {
      this.getAllTeams();
    });
  }

  getAllTeams() {
    this.teamService.getAllTeams().pipe(
      tap((resp: any) => {
        this.teams = resp;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      }),
      tap(() => {
        const observables = this.teams.map((team, index) =>
          this.fetchTeamStatistics(team.teamId, index, this.selectedYear)
        );
        forkJoin(observables).subscribe(() => {
          this.sortTeamsByPoints();
        });
      })
    ).subscribe();
  }

  fetchTeamStatistics(teamId: any, index: number, year: any): Observable<any> {
    return forkJoin([
      this.teamResultService.getMatchesPlayed(teamId, year.yearId),
      this.teamResultService.getMatchesWon(teamId, year.yearId),
      this.teamResultService.getMatchesLost(teamId, year.yearId),
      this.teamResultService.getMatchesDrawn(teamId, year.yearId),
      this.teamResultService.getAverage(teamId, year.yearId),
      this.teamResultService.getPoints(teamId, year.yearId)
    ]).pipe(
      tap(([matchesPlayed, matchesWon, matchesLost, matchesDrawn, average, points]) => {
        this.teams[index].matchesPlayed = matchesPlayed;
        this.teams[index].matchesWon = matchesWon;
        this.teams[index].matchesLost = matchesLost;
        this.teams[index].matchesDrawn = matchesDrawn;
        this.teams[index].average = average;
        this.teams[index].points = points;
      })
    );
  }

  setSelectedYear(year: any) {
    this.selectedYear = year;
    this.getAllTeams();
  }

  sortTeamsByPoints() {
    this.teams.sort((a, b) => b.points - a.points);
    this.detectChanges();
  }

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }
}
