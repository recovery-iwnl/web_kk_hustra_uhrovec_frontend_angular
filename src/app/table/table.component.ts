import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TeamService} from "../services/teamService/team.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-tabulka',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  selectedLeague: string = "1.KL Západ";

  teams : any [] = [];

  columns: string[] = ['#', 'Klub', 'Záp', 'V', 'R', 'P', 'Priemer', 'Body']

  constructor(private teamService: TeamService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getAllTeams()
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

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }



  changeTable(league: string) {
    this.selectedLeague = league;
  }

}
