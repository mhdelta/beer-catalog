import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Beer } from '../models/beer.model';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  constructor(
    private http: HttpClient
  ) {}

  getData(query: string = ' ') {
    const params = new HttpParams().set('beer_name', query);
    return this.http.get<Beer[]>('https://api.punkapi.com/v2/beers', {params});
  }

}
