import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {ResultService} from "../services/resultService/result.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {AuthService} from "../services/auth/auth.service";
import {TeamService} from "../services/teamService/team.service";
import {DatePipe} from "@angular/common";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LeagueYearService} from "../services/leagueYearService/league-year.service";
import {MatSelectChange} from "@angular/material/select";

/**
 * ResultsComponent is an Angular component responsible for managing and displaying sports results.
 * It provides functionality for adding, updating, and deleting results, as well as validating input data.
 *
 */
@Component({
  selector: 'app-vysledky',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent {
  /**
   * Represents the selected sports league for displaying results.
   */
  selectedLeague: string = '1.KL Západ';

  /**
   * Array containing all sports results.
   */
  results: any[] = [];

  /**
   * Represents a single sports result.
   */
  result: any = {};

  /**
   * Array containing all sports teams.
   */
  teams: any[] = [];

  /**
   * Array containing all league years.
   */
  years: any[] = [];

  /**
   * Represents the home team in a sports result.
   */
  teamHome: any = {};

  /**
   * Array containing players from the home team.
   */
  playersHome: any[] = [];

  /**
   * Represents the away team in a sports result.
   */
  teamAway: any = {};

  /**
   * Array containing players from the away team.
   */
  playersAway: any[] = [];

  /**
   * Represents the selected date for a sports result.
   */
  dateShow: any = {};

  selectedYear: any = {};

  selectedFilter: any = {};



  /**
   * Creates an instance of ResultsComponent.
   *
   * @param datePipe - Reference to the DatePipe for formatting dates.
   * @param teamService - Reference to the TeamService for managing team-related operations.
   * @param dialog - Reference to the MatDialog for displaying dialogs.
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param resultService - Reference to the ResultService for managing result-related operations.
   * @param cdRef - Reference to the ChangeDetectorRef for manually detecting changes.
   * @param ngZone - Reference to the NgZone for managing change detection within or outside Angular zones.
   */
  constructor(private datePipe: DatePipe, private teamService: TeamService, private leagueYearService: LeagueYearService, private dialog: MatDialog, private authService: AuthService, private resultService: ResultService, private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
  }

  /**
   * Initializes the component by fetching all results and teams.
   */
  ngOnInit(): void {
    this.getAllTeams();
    this.getAllYearsAndResultsForFirstYear();
    this.selectedFilter = "Všetky výsledky";
  }

  setSelectedFilter(filter : string) {
    this.selectedFilter = filter;
  }

  getAllYearsAndResultsForFirstYear() {
    this.leagueYearService.getAllYears().pipe(
      tap((resp: any) => {
        this.years = resp;
        if (this.years.length > 0) {
          this.getResultsByYear(this.years[0].yearId);
          this.selectedYear = this.years[0].year;
        }
        console.log(this.years)
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getAllYears() {
    this.leagueYearService.getAllYears().pipe(
      tap((resp: any) => {
        this.years = resp;
        console.log(this.years)
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Deletes a sports result.
   *
   * @param result - The sports result to be deleted.
   */
  deleteResult(result: any) {
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

  /**
   * Opens a confirmation dialog for deleting a sports result.
   *
   * @param event - The event triggering the delete action.
   * @param resultN - The sports result to be deleted.
   */
  confirmDelete(event: Event, resultN: any): void {
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

  /**
   * Handles the selection of a date for a sports result.
   *
   * @param selectedDate - The selected date.
   */
  onDateSelected(selectedDate: Date): void {
    this.result.date = this.formatDate(selectedDate);
  }

  /**
   * Formats a date using the DatePipe.
   *
   * @param date - The date to be formatted.
   * @returns The formatted date as a string.
   */
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }


  /**
   * Checks if the form for adding a result is valid.
   *
   * @returns True if the form is valid, false otherwise.
   */
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

    const playerPoints = [
      this.result.team1PointsOverall,
      this.result.player1PointsHome,
      this.result.player2PointsHome,
      this.result.player3PointsHome,
      this.result.player4PointsHome,
      this.result.player5PointsHome,
      this.result.player6PointsHome,


      this.result.team2PointsOverall,
      this.result.player1PointsAway,
      this.result.player2PointsAway,
      this.result.player3PointsAway,
      this.result.player4PointsAway,
      this.result.player5PointsAway,
      this.result.player6PointsAway,
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

    return playerPoints.every(score => score !== undefined && score !== null && score !== '') &&
      playerScores.every(score => score !== undefined && score !== null && score !== '') &&
      players.every(player => player !== undefined && player !== null && player !== '') &&
      this.result.date !== undefined && this.result.date !== '' && this.result.leagueYear !== undefined && this.result.leagueYear !== '';
  }

  /**
   * Checks if the input values for adding a result are valid.
   *
   * @returns True if the input values are valid, false otherwise.
   */
  areInputsValid(): boolean {
    return (
      this.isWithinInterval(this.result.team1PointsOverall, 0, 8) &&
      this.isWithinInterval(this.result.team2PointsOverall, 0, 8) &&

      this.isWithinInterval(this.result.player1ScoreHome, 0, 1000) &&
      this.isWithinInterval(this.result.player2ScoreHome, 0, 1000) &&
      this.isWithinInterval(this.result.player3ScoreHome, 0, 1000) &&
      this.isWithinInterval(this.result.player4ScoreHome, 0, 1000) &&
      this.isWithinInterval(this.result.player5ScoreHome, 0, 1000) &&
      this.isWithinInterval(this.result.player6ScoreHome, 0, 1000) &&
      this.isWithinInterval(this.result.player1ScoreAway, 0, 1000) &&
      this.isWithinInterval(this.result.player2ScoreAway, 0, 1000) &&
      this.isWithinInterval(this.result.player3ScoreAway, 0, 1000) &&
      this.isWithinInterval(this.result.player4ScoreAway, 0, 1000) &&
      this.isWithinInterval(this.result.player5ScoreAway, 0, 1000) &&
      this.isWithinInterval(this.result.player6ScoreAway, 0, 1000) &&

      this.isWithinInterval(this.result.player1PointsHome, 0, 1) &&
      this.isWithinInterval(this.result.player2PointsHome, 0, 1) &&
      this.isWithinInterval(this.result.player3PointsHome, 0, 1) &&
      this.isWithinInterval(this.result.player4PointsHome, 0, 1) &&
      this.isWithinInterval(this.result.player5PointsHome, 0, 1) &&
      this.isWithinInterval(this.result.player6PointsHome, 0, 1) &&
      this.isWithinInterval(this.result.player1PointsAway, 0, 1) &&
      this.isWithinInterval(this.result.player2PointsAway, 0, 1) &&
      this.isWithinInterval(this.result.player3PointsAway, 0, 1) &&
      this.isWithinInterval(this.result.player4PointsAway, 0, 1) &&
      this.isWithinInterval(this.result.player5PointsAway, 0, 1) &&
      this.isWithinInterval(this.result.player6PointsAway, 0, 1)
    );
  }

  /**
   * Checks if a numeric value is within a specified interval.
   *
   * @param value - The numeric value to be checked.
   * @param min - The minimum value of the interval.
   * @param max - The maximum value of the interval.
   * @returns True if the value is within the interval, false otherwise.
   */
  isWithinInterval(value: number, min: number, max: number): boolean {
    return value !== undefined && value !== null && value >= min && value <= max;
  }

  /**
   * Checks if the teams or players in a sports result are the same.
   *
   * @returns True if the teams or players are the same, false otherwise.
   */
  areTeamsOrPlayersSame(): boolean {
    const areTeamsOrPlayersSame =
      this.teamHome &&
      this.teamAway &&
      (this.teamHome.teamId === this.teamAway.teamId ||
        this.arePlayersOnSameSideSame('Home') ||
        this.arePlayersOnSameSideSame('Away'))

    return areTeamsOrPlayersSame;
  }

  /**
   * Checks if players on the same side (home/away) have the same ID.
   *
   * @param side - The side (home/away) to check.
   * @returns True if players on the same side have the same ID, false otherwise.
   */
  arePlayersOnSameSideSame(side: string): boolean {
    for (let i = 1; i <= 6; i++) {
      const playerID1 = this.result[`player${i}${side}`]?.playerID;
      for (let j = i + 1; j <= 6; j++) {
        const playerID2 = this.result[`player${j}${side}`]?.playerID;

        if (playerID1 && playerID2 && playerID1 === playerID2) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Fetches all sports teams.
   */
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


  /**
   * Updates the points based on the scores in a sports result.
   *
   * @param result - The sports result for which points are updated.
   */
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
        return Array.from({length: playerCount}, (_, i) => result[`${playerKey}${i + 1}${scoreKey}`] || 0)
          .reduce((total, score) => total + parseFloat(score), 0);
      }

      if (result.team1ScoreOverall > result.team2ScoreOverall) {
        result.team1PointsOverall += 2;
      } else if (result.team1ScoreOverall < result.team2ScoreOverall) {
        result.team2PointsOverall += 2;
      } else {
        result.team1PointsOverall += 1;
        result.team2PointsOverall += 1;
      }
    });
  }


  /**
   * Fetches players from the home team based on the team ID.
   *
   * @param id - The ID of the home team.
   */
  getPlayersByTeamHome(id: any) {
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

  /**
   * Fetches players from the away team based on the team ID.
   *
   * @param id - The ID of the away team.
   */
  getPlayersByTeamAway(id: any) {
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

  /**
   * Handles the change in selection of the home team.
   *
   * @param selectedTeam - The selected home team.
   */
  onTeamHomeSelectionChange(selectedTeam: any) {
    this.result.player1Home = null;
    this.result.player2Home = null;
    this.result.player3Home = null;
    this.result.player4Home = null;
    this.result.player5Home = null;
    this.result.player6Home = null;
    this.teamHome = selectedTeam;
    console.log('Selected team for teamHome:', this.teamHome);
    this.getPlayersByTeamHome(this.teamHome.teamId);
  }

  /**
   * Handles the change in selection of the away team.
   *
   * @param selectedTeam - The selected away team.
   */
  onTeamAwaySelectionChange(selectedTeam: any) {
    this.result.player1Away = null;
    this.result.player2Away = null;
    this.result.player3Away = null;
    this.result.player4Away = null;
    this.result.player5Away = null;
    this.result.player6Away = null;
    this.teamAway = selectedTeam;
    console.log('Selected team for teamHome:', this.teamAway);
    this.getPlayersByTeamAway(this.teamAway.teamId);
  }

  /**
   * Fetches all sports results.
   */
  getAllResults() {
    this.resultService.getAllResults().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.results = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getResultsByYear(id : any) {
    this.resultService.getResultsByYear(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.results = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Adds a sports result to the list of results.
   */
  addResult() {
    console.log(this.result);
    this.resultService.addResultSimple(this.teamHome.teamId, this.teamAway.teamId, this.result).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.results.push(resp);
        this.getAllResults();
        this.resetForm();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Resets the form for adding a sports result.
   */
  resetForm() {
    this.result = {};
    this.teamHome = {};
    this.teamAway = {};
    this.dateShow = {};
  }

  /**
   * Fetches results specific to Uhrovec.
   */
  getResultsUhrovec() {
    this.resultService.getResultsUhrovec().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.results = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Manually triggers change detection to update the view.
   */
  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {
    }
  }

  /**
   * Checks if the currently logged-in user has admin privileges.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

  /**
   * Reference to the console for logging.
   */
  protected readonly console = console;

  setSelectedYear(year: any) {
    this.selectedYear = year.year;
    this.getResultsByYear(year.yearId);
  }
}
