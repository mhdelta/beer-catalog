import { Component, OnInit } from '@angular/core';
import { BeerService } from './services/beer.service';
import { Beer } from './models/beer.model';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [BeerService]
})
export class AppComponent implements OnInit {
  title = 'beer-catalog-client';

  searchTerm$ = new ReplaySubject<string>();
  results$: Observable<Beer[]>;
  data: Beer[];

  constructor(
    private beerService: BeerService
  ) {}
  ngOnInit() {
    this.results$ = this.searchTerm$.pipe(
      switchMap(query => this.beerService.getData(query))
    );
    this.search({target: {value: 'red'}});

  }

  search(event) {
    this.beerService.getData(event.target.value).subscribe(
      res => {
        this.data = res;
        console.log(this.data);
      }
    );
  }
}


