import {ChangeDetectorRef, Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {PlayerService} from "../services/playerService/player.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-hraci',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {

  players: any[] = [];

  shownPlayer: any = {};

  newPlayer: any = {};

  constructor(private playerService: PlayerService, private dialog: MatDialog, private authService: AuthService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getAllPlayers();
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

  addPlayer(newP : any) {
    this.playerService.addPlayer(newP).pipe(
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

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

}
