import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Beer } from '../models/beer.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BeerService {

  constructor(
    private http: HttpClient
  ) {}

  formatDate(date){
    console.log(date);
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    return month + '-' + year;
  }

  getData(query: any) {
    if(query[0]=='') query[0] = ' ';  
    const params = new HttpParams()
    .set('beer_name', query[0])
    .set('abv_gt', query[1]["abvBottom"])
    .set('abv_lt', query[1]["abvTop"])
    .set('ibu_gt', query[1]["ibuBottom"])
    .set('ibu_lt', query[1]["ibuTop"])
    .set('ebc_gt', query[1]["ebcBottom"])
    .set('ebc_lt', query[1]["ebcTop"])
    .set("yeast", query[1]["yeast"])
    .set("hops", query[1]["hops"])
    .set("malt", query[1]["malt"])
    .set("brewed_before", this.formatDate(query[1]["brewedBefore"]))
    .set("brewed_after", this.formatDate(query[1]["brewedAfter"]));
    return this.http.get<Beer[]>('https://api.punkapi.com/v2/beers', {params});
  }

}
