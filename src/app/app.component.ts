import { Component, OnInit, ViewChild } from '@angular/core';
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


