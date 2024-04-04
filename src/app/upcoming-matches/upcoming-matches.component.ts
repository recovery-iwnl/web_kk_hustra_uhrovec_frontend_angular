import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {TeamService} from "../services/teamService/team.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {MatchService} from "../services/matchService/match.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-upcoming-matches',
  templateUrl: './upcoming-matches.component.html',
  styleUrls: ['./upcoming-matches.component.css']
})
export class UpcomingMatchesComponent implements OnInit {


  teamHome: any = {};

  teamAway: any = {};

  teams: any[] = [];

  matches: any[] = [];

  match: any = {};

  dateShow: any = {};

  selectedFilter: any = {};


  currentPage: number = 1;
  matchesPerPage: number = 6;

  totalPages: any;

  constructor(private datePipe: DatePipe,
              private teamService: TeamService,
              private dialog: MatDialog,
              private authService: AuthService,
              private matchService: MatchService,
              private cdRef: ChangeDetectorRef,
              private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.getAllMatches();
    this.getAllTeams();
    this.selectedFilter = "Všetky zápasy";
  }

  setSelectedFilter(filter: string) {
    this.currentPage = 1;
    this.totalPages = 1;
    this.selectedFilter = filter;
  }

  addMatch() {
    this.matchService.addMatch(this.match.teamHome.teamId, this.match.teamAway.teamId, this.match).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.matches.push(resp);
        this.getAllMatches();
        this.resetForm();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  resetForm() {
    this.match = {};
    this.teamHome = {};
    this.teamAway = {};
    this.dateShow = {};
  }

  deleteMatch(match: any) {
    this.matchService.deleteMatch(match.matchId).pipe(
      tap(() => {
        this.matches = this.matches.filter(m => m.matchId !== match.matchId);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }


  getAllMatches() {
    const startIndex = (this.currentPage - 1) * this.matchesPerPage;
    const endIndex = startIndex + this.matchesPerPage;
    this.matchService.getAllMatches().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.calculateTotalPages(resp.length);
        this.matches = resp.slice(startIndex, endIndex);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getMatchesUhrovec() {
    const startIndex = (this.currentPage - 1) * this.matchesPerPage;
    const endIndex = startIndex + this.matchesPerPage;
    this.matchService.getMatchesUhrovec().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.calculateTotalPages(resp.length);
        this.matches = resp.slice(startIndex, endIndex);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  calculateTotalPages(totalMatches: number) {
    if(totalMatches == 0) {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(totalMatches / this.matchesPerPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if(this.selectedFilter == "Všetky zápasy") {
        this.getAllMatches();
      } else {
        this.getMatchesUhrovec();
      }

    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if(this.selectedFilter == "Všetky zápasy") {
        this.getAllMatches();
      } else {
        this.getMatchesUhrovec();
      }
    }
  }

  confirmDelete(event: Event, matchN: any): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať zápas ' + matchN.teamHome.teamName + ' vs ' + matchN.teamAway.teamName + ' ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMatch(matchN);
      }
    });
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


  onDateSelected(selectedDate: Date): void {
    this.match.date = this.formatDate(selectedDate);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  isFormValid(): boolean {
    return this.match.teamAway !== undefined && this.match.teamHome !== undefined && this.match.date !== undefined && this.match.date !== '';
  }

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {
    }
  }

  isAdmin(): boolean {
    const token = this.cookie.get("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.role === 'ADMIN';
    } else {
      return false;
    }
  }
}
