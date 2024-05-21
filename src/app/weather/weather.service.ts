import { Directive, Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { WindDirection } from './weather-model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }

  public getEntityStrings(): Observable<string[]> {
    const directions = ['N',
                        'NNE',
                        'NE',
                        'ENE',
                        'E',
                        'ESE',
                        'SE',
                        'SSE',
                        'S',
                        'SSW',
                        'SW',
                        'WSW',
                        'W',
                        'WNW',
                        'NW',
                        'NNW'
    ];

    return Observable.create((observer: Subscriber<any>) => {
      observer.next(directions);
      observer.complete();
    });
  }

  public getEntities(): Observable<WindDirection[]> {
    const directions = [{ Direction: 'N' },
                        { Direction: 'NNE' },
                        { Direction: 'NE' },
                        { Direction: 'ENE' },
                        { Direction: 'E' },
                        { Direction: 'ESE' },
                        { Direction: 'SE' },
                        { Direction: 'SSE' },
                        { Direction: 'S' },
                        { Direction: 'SSW' },
                        { Direction: 'SW' },
                        { Direction: 'WSW' },
                        { Direction: 'W' },
                        { Direction: 'WNW' },
                        { Direction: 'NW' },
                        { Direction: 'NNW' }
    ];

    return Observable.create((observer: Subscriber<any>) => {
      observer.next(directions);
      observer.complete();
    });
  }

}
