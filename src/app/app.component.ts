import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private beerService: BeerService
  ) { }
  title = 'beer-catalog-client';
  abvCaps: Abv;
  abvRanges = ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '70+'];
  ibuRanges = {
    Lambic: [0, 10],
    'Wheat beer': [8, 18],
    'American lager': [8, 26],
    Köisch: [20, 30],
    Pilsner: [24, 44],
    Porter: [18, 50],
    Bitter: [24, 50],
    'Pale ale': [30, 50],
    Stout: [30, 90],
    'India pale ale': [40, 120]
  };
  ibuNames = Object.keys(this.ibuRanges);
  filtertype: number;
  selectedrange: string;
  searchString: string;
  searchStream$ = new Subject<string>();

  results$: Observable<Beer[]>;
  data: Beer[];

  EbcColors = {
    4: 'F8F753',
    6: 'F6F513',
    8: 'ECE61A',
    12: 'D5BC26',
    16: 'BF923B',
    20: 'BF813A',
    26: 'BC6733',
    33: '8D4C32',
    39: '5D341A',
    47: '261716',
    57: '0F0B0A',
    69: '080707',
    79: '030403',
  };

  srmRanges = {
    'Pale yellow color': [1.0 , 3.0],
    'Medium yellow': [3.0 , 4.5],
    Gold: [4.5 , 7.5],
    Amber: [7.5 , 9.0],
    Copper: [9.0 , 11.0],
    'Red/Brown': [11.0 , 14.0],
    Brown: [14.0 , 19.0],
    Black: [20.0,  10000],
  };

  ngOnInit() {
    this.searchStream$.pipe(
      debounceTime(500),
      filter(x => x !== null && x !== '')
    ).subscribe(
      term => this.search(term)
    );
    setTimeout(() => {
      this.search('lager');
    }, 500);
  }

  ibuFilter() {
    if (this.selectedrange) {
      const ibu = this.ibuRanges[this.selectedrange][1];
      const query = { filter: 'ibu', param: ibu };
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


  getEbcColor(ebc: number): string {
    if (ebc != null) {
      const closest = Object.keys(this.EbcColors).reduce((a, b) => {
        return Math.abs(+b - ebc) < Math.abs(+a - ebc) ? b : a;
      });
      return `fill:#${this.EbcColors[closest]}`;
    }
    return `fill:#FFFFFF`;
  }

  getSRMString(srm: number): string {
    if (srm != null) {
      return Object.keys(this.srmRanges).filter(x => srm > this.srmRanges[x][0] && srm < this.srmRanges[x][1])[0];
    }
  }

  ngOnDestroy() {
    this.searchStream$.unsubscribe();
  }
}


