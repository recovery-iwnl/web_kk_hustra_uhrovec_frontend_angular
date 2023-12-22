import {ChangeDetectorRef, Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {PlayerService} from "../services/playerService/player.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-hraci',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {

  players: any[] = [];

  shownPlayer: any = {};

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

  showPlayerDetails(player: any) {
    this.playerService.getPlayer(player.playerID).pipe(
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

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  protected readonly console = console;
}
