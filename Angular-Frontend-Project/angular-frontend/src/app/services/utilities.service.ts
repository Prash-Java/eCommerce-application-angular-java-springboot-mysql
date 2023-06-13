import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for(let theMonth=startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    let currentYear:number = new Date().getFullYear();
    let endYear:number = currentYear + 10;
    for(let theYear=currentYear; theYear<=endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}
