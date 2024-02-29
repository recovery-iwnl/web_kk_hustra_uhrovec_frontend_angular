import {ChangeDetectorRef, Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {PlayerService} from "../services/playerService/player.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {TeamService} from "../services/teamService/team.service";
import {PlayerResultService} from "../services/playerResultService/player-result.service";
import {LeagueYearService} from "../services/leagueYearService/league-year.service";

/**
 * PlayersComponent is an Angular component responsible for managing and displaying player information.
 * It includes features such as retrieving players by team, displaying player details, adding, updating, and deleting players.
 *
 */
@Component({
  selector: 'app-hraci',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {

  /**
   * Array containing information about players in a team.
   */
  players: any[] = [];

  /**
   * Represents the currently displayed player details.
   */
  shownPlayer: any = {};

  matchesPlayed: any;

  average: any;

  playersBest: any;

  /**
   * Represents a new player to be added.
   */
  newPlayer: any = {};

  /**
   * Array containing all league years.
   */
  years: any[] = [];


  selectedYear: any = {};

  /**
   * Creates an instance of PlayersComponent.
   *
   * @param playerService - Reference to the PlayerService for managing player-related operations.
   * @param teamService - Reference to the TeamService for managing team-related operations.
   * @param dialog - Reference to the MatDialog service for displaying dialogs.
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param cdRef - Reference to the ChangeDetectorRef for manual change detection.
   */
  constructor(private playerService: PlayerService, private leagueYearService: LeagueYearService, private playerResultService: PlayerResultService, private teamService: TeamService,private dialog: MatDialog, private authService: AuthService, private cdRef: ChangeDetectorRef) {
  }

  /**
   * Lifecycle hook that is called after the component is created.
   * Initializes the component by retrieving players by team.
   */
  ngOnInit(): void {
    this.getAllYears();
    this.getPlayersByTeam();
  }

  getAllYears() {
    this.leagueYearService.getAllYears().pipe(
      tap((resp: any) => {
        this.years = resp;
        console.log(this.years);
        this.selectedYear = this.years[0];
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Retrieves players from a team and updates the 'players' array.
   */
  getPlayersByTeam() {
    this.teamService.getPlayersUhrovec().pipe(
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

  /**
   * Retrieves detailed information about a player by their ID and updates the 'shownPlayer' property.
   *
   * @param playerID - The ID of the player to retrieve details for.
   */
  getPlayerDetails(playerID: number) {
    this.playerService.getPlayer(playerID).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.shownPlayer = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getMatchesPlayedByPlayer(playerID: number) {
    this.playerResultService.getMatchesPlayed(playerID,this.selectedYear.yearId).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.matchesPlayed = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getAverageByPlayer(playerID: number) {
    this.playerResultService.getAverage(playerID,this.selectedYear.yearId).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.average = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getPlayersBest(playerID: number) {
    this.playerResultService.getPlayersBest(playerID,this.selectedYear.yearId).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.playersBest = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Opens a confirmation dialog to confirm player deletion.
   * If the user confirms, deletes the player from the team.
   *
   * @param event - The click event triggering the confirmation dialog.
   * @param player - The player to be deleted.
   */
  confirmDelete(event: Event,player:any): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať hráča ' + player.name + ' ' + player.surname + ' ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePlayer(player);
      }
    });
  }

  /**
   * Deletes the player from the team.
   * Updates the 'players' array and triggers change detection.
   *
   * @param player - The player to be deleted.
   */
  deletePlayer(player: any) {
    this.playerService.deletePlayer(player.playerID).pipe(
      tap((resp: any) => {
        console.log("Player "+ player.name + " " + player.surname +  " deleted");
        this.players = this.players.filter(p => p.playerID !== player.playerID);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Adds a new player to the team Uhrovec.
   * Updates the 'players' array and triggers change detection.
   *
   * @param newP - The new player to be added.
   */
  addPlayer(newP : any) {
    this.playerService.addPlayerUhrovec(newP).pipe(
      tap((resp: any) => {
          console.log("Player " + newP.name + " " + newP.surname + " added");
          newP.playerID = resp.playerID
          this.players.push(newP);
          this.newPlayer = {};
          this.detectChanges();
        }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Updates the information of an existing player.
   * Updates the 'players' array and triggers change detection.
   *
   * @param updatedPlayer - The updated player information.
   */
  updatePlayer(updatedPlayer: any) {
    console.log(updatedPlayer);
    this.playerService.updatePlayer(updatedPlayer).pipe(
      tap((resp: any) => {
        const index = this.players.findIndex(p => p.playerID === updatedPlayer.playerID);
        if (index !== -1) {
          this.players[index] = resp;
          this.detectChanges();
        }
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  setSelectedYear(year: any) {
    this.selectedYear = year;
    this.detectChanges();
  }

  /**
   * Detects changes manually in the component.
   * This is necessary in certain situations where Angular's change detection may not be triggered automatically.
   */
  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  /**
   * Checks if the currently logged-in user has the 'ADMIN' role.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

}
