import { Component, OnInit } from '@angular/core';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { BeerService } from 'src/app/services/beer.service';
import { Beer } from 'src/app/models/beer.model';
import { Abv } from 'src/app/models/abv.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  providers: [BeerService]
})
export class FilterComponent implements OnInit {

  filterForm = new FormGroup({
    abvBottom : new FormControl(0, [Validators.min(0), Validators.max(55)]),
    abvTop : new FormControl(55,[Validators.min(0), Validators.max(55)]),
    ibuBottom : new FormControl(0, [Validators.min(0), Validators.max(55)]),
    ibuTop : new FormControl(1157,[Validators.min(0), Validators.max(55)]),
    ebcBottom : new FormControl(0, [Validators.min(0), Validators.max(55)]),
    ebcTop : new FormControl(600,[Validators.min(0), Validators.max(55)]),
    yeast : new FormControl(' '),
    hops : new FormControl(' '),
    malt : new FormControl(' '),
    brewedBefore: new FormControl('2020-01'),
    brewedAfter: new FormControl('2007-05')
  });
 
  searchStream$ = new Subject<string>();
  results$: Observable<Beer[]>;
  data: Beer[];
  
  constructor(private beerService: BeerService) { }

  ngOnInit(): void {
  }

}
