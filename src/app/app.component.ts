import { Component, OnInit } from '@angular/core';
import { BeerService } from './services/beer.service';
import { Beer } from './models/beer.model';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [BeerService]
})
export class AppComponent implements OnInit {
  title = 'beer-catalog-client';


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

  ngOnDestroy() {
    this.searchStream$.unsubscribe();
  }
}


