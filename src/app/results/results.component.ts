import {ChangeDetectorRef, Component} from '@angular/core';
import {ResultService} from "../services/resultService/result.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-vysledky',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  selectedLeague: string = '1.KL Západ';

  results : any[] = [];

  panelOpenState = false;
  constructor(private resultService: ResultService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getAllResults()
  }

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

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

}
