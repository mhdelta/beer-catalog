import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BeerService } from './services/beer.service';
import { Beer } from './models/beer.model';
import { Observable, ReplaySubject, Subject, merge, combineLatest} from 'rxjs';
import { debounceTime, filter, combineAll, startWith } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [BeerService]
})
export class AppComponent implements OnInit {
  
  @ViewChild(FilterComponent) filter: FilterComponent;
  title = 'beer-catalog-client';
 
  searchString: string;
  searchStream$ = new Subject<string>();
  formStream$ = new Subject<FormGroup>();
  searchTerm : string;
  results$: Observable<Beer[]>;
  data: Beer[];
  filteredForm : FormGroup;
  constructor(
    private beerService: BeerService
  ) {}

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


  }

  ngAfterViewInit() {
    this.filter.filterForm.valueChanges.subscribe(
      form => {
        this.formStream$.next(form);
      }
    );
    combineLatest(this.searchStream$.pipe(startWith(" ")), this.formStream$.pipe(startWith(this.filter.filterForm.value))).pipe(
      debounceTime(500),
      filter(x => x !== [null, null] && x !== ["", null])
    ).subscribe(
      term => {
        console.log(term)
        this.search(term)
      }
    );
    // setTimeout(() => {
    //   this.search('lager');
    // }, 500);
  }

  inputEvent(term) {
    this.searchStream$.next(term);
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
    this.formStream$.unsubscribe();
  }
}


