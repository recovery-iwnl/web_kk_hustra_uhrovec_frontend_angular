import { Component } from '@angular/core';

@Component({
  selector: 'app-vysledky',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  selectedLeague: string = '1.KL Západ';

  changeTable(league: string) {
    this.selectedLeague = league;
  }

}
