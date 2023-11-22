import { Component } from '@angular/core';

@Component({
  selector: 'app-tabulka',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  selectedLeague: string = "1.KL Západ";

  changeTable(league: string) {
    this.selectedLeague = league;
  }

}
