import { Component, OnInit } from '@angular/core';
import { BeerService } from './services/beer.service';
import { Beer } from './models/beer.model';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Abv } from './models/abv.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [BeerService]
})
export class AppComponent implements OnInit {
  title = 'beer-catalog-client';
  abvcaps : Abv;
  abvranges = ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "70+"];
  iburanges = {
    "Lambic": [0,10],
    "Wheat beer" : [8,18],
    "American lager": [8,26],
    "Köisch" : [20,30],
    "Pilsner" : [24,44],
    "Porter" : [18,50],
    "Bitter" : [24,50],
    "Pale ale": [30, 50],
    "Stout" : [30, 90],
    "India pale ale": [40, 120]
  };
  ibunames = Object.keys(this.iburanges);
  filtertype: number;
  selectedrange : string;
  searchString: string;
  searchStream$ = new Subject<string>();

  results$: Observable<Beer[]>;
  data: Beer[];

  constructor(
    private beerService: BeerService
  ) {}

  ngOnInit() {
    this.searchStream$.pipe(
      debounceTime(500),
      filter(x => x !== null && x !== '')
    ).subscribe(
      term => this.search(term)
    );
  }

  ibufilter(){
    if(this.selectedrange){
      const ibu = this.iburanges[this.selectedrange][1];
      const query = {"filter": "ibu", "param":ibu}
      this.filterBeers(query);
    }
  }

  inputEvent(term) {
    this.searchStream$.next(term);
  }

  filterBeers(condition) {
    this.beerService.getFiltered(condition).subscribe(
      res => {
        this.data = res;
      }
      );
  }
  search(term) {
    this.beerService.getData(term).subscribe(
      res => {
        this.data = res;
      }
      );
    }

  ngOnDestroy() {
    this.searchStream$.unsubscribe();
  }
}


