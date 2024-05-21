import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouteService } from '../route/route.service';
import { Route } from '../route/route-model';
import { WeatherService } from '../weather/weather.service';
import { WindDirection } from '../weather/weather-model';
import { ShoeService } from '../shoe/shoe.service';
import { Shoe } from '../shoe/shoe-model';
import { RecreationalWalk, TrainingWalk } from './walk-model';
import { WalkService } from './walk.service';
import { AlertService } from '../alert/alert.service';
import { GpxRequest } from '../common/common-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-walk',
  templateUrl: './walk.component.html',
  styleUrls: ['./walk.component.css']
})

export class WalkComponent implements OnInit {
  public routes: Route[];
  public windDirections: WindDirection[];
  public shoes: Shoe[];
  public walkForm: FormGroup;
  private errorMessage: string;
  public walkType: any;

  constructor(private routeService: RouteService,
    private weatherService: WeatherService,
    private shoeService: ShoeService,
    private walkService: WalkService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute) {
    this.walkForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.walkType = data;
    })
  
    this.loadRoutes();
    this.loadWindDirections();
    this.loadShoes();
  }

  public addWalk() {
    var walk: any;

    if (this.walkType.name == 'training') {
      walk = new TrainingWalk();

      walk.exerciseDate = this.walkForm.controls['date'].value;
      walk.shoe = this.walkForm.controls['shoe'].value;
      walk.equipmentId = walk.shoe.id;
      walk.shoe = null;
      walk.route = this.walkForm.controls['route'].value;
      walk.routeId = walk.route.id;
      walk.route = null;
      walk.quantity = this.walkForm.controls['distance'].value;
      walk.startTime = this.walkForm.controls['startTime'].value;
      walk.endTime = this.walkForm.controls['endTime'].value;
      walk.averageHr = this.walkForm.controls['averageHr'].value;
      walk.maxHr = this.walkForm.controls['maxHr'].value;
      walk.elevationGain = this.walkForm.controls['elevationGain'].value;
      walk.maxSpeed = this.walkForm.controls['maxSpeed'].value;
      walk.windSpeed = this.walkForm.controls['windSpeed'].value;
      walk.windDirection = this.walkForm.controls['windDirection'].value.Direction;
      walk.temperature = this.walkForm.controls['temperature'].value;
      walk.precipitation = this.walkForm.controls['precipitation'].value === 'Yes';
      walk.numberOfAttempts = this.walkForm.controls['numberAttempts'].value;
      walk.numberOfSuccesses = this.walkForm.controls['numberSuccesses'].value;
      walk.notes = this.walkForm.controls['notes'].value;

      let gpxRequest = new GpxRequest();
      gpxRequest.TrainingWalk = walk;

      this.walkService.postTrainingWalk(gpxRequest)
        .subscribe(result => {
          this.alertService.success('Training walk successfully added.');
          this.clearForm();
        }, error => {
          console.log(error);
          this.alertService.error('Training walk was not successfully added.');
        });
    }
    else {
      walk = new RecreationalWalk();

      walk.exerciseDate = this.walkForm.controls['date'].value;
      walk.shoe = this.walkForm.controls['shoe'].value;
      walk.equipmentId = walk.shoe.id;
      walk.shoe = null;
      walk.route = this.walkForm.controls['route'].value;
      walk.routeId = walk.route.id;
      walk.route = null;
      walk.quantity = this.walkForm.controls['distance'].value;
      walk.startTime = this.walkForm.controls['startTime'].value;
      walk.endTime = this.walkForm.controls['endTime'].value;
      walk.pathEndTime = this.walkForm.controls['pathEndTime'].value;
      walk.averageHr = this.walkForm.controls['averageHr'].value;
      walk.maxHr = this.walkForm.controls['maxHr'].value;
      walk.elevationGain = this.walkForm.controls['elevationGain'].value;
      walk.maxSpeed = this.walkForm.controls['maxSpeed'].value;
      walk.wind = this.walkForm.controls['wind'].value;
      walk.temperature = this.walkForm.controls['temperature'].value;
      walk.precipitation = this.walkForm.controls['precipitation'].value === 'Yes';
      walk.notes = this.walkForm.controls['notes'].value;

      let gpxRequest = new GpxRequest();
      gpxRequest.RecreationalWalk = walk;

      this.walkService.postRecreationalWalk(gpxRequest)
        .subscribe(result => {
          this.alertService.success('Recreational walk successfully added.');
          this.clearForm();
        }, error => {
          console.log(error);
          this.alertService.error('Recreational walk was not successfully added.');
        });
    }
  }

  public importWalk(){
    
  }

  private loadRoutes() {
    this.routeService.getEntities().subscribe(
      routes => {
        this.routes = routes;
      },
      error => this.errorMessage = <any>error
    );
  }

  private loadShoes() {
    this.shoeService.getEntities().subscribe(
      shoes => {
        this.shoes = shoes;
      },
      error => this.errorMessage = <any>error
    );
  }

  private loadWindDirections() {
    this.weatherService.getEntities().subscribe(
      windDirections => {
        this.windDirections = windDirections;
      },
      error => this.errorMessage = <any>error
    );
  }

  private clearForm() {
    this.walkForm.controls['distance'].setValue('');
    this.walkForm.controls['startTime'].setValue('');
    this.walkForm.controls['endTime'].setValue('');
    this.walkForm.controls['pathEndTime'].setValue('');
    this.walkForm.controls['averageHr'].setValue('');
    this.walkForm.controls['maxHr'].setValue('');
    this.walkForm.controls['elevationGain'].setValue('');
    this.walkForm.controls['maxSpeed'].setValue('');
    this.walkForm.controls['windSpeed'].setValue('');
    this.walkForm.controls['windDirection'].setValue('');
    this.walkForm.controls['wind'].setValue('');
    this.walkForm.controls['temperature'].setValue('');
    this.walkForm.controls['precipitation'].setValue('');
    this.walkForm.controls['numberAttempts'].setValue('');
    this.walkForm.controls['numberSuccesses'].setValue('');
    this.walkForm.controls['notes'].setValue('');
  }

  createFormGroup() {
    return new FormGroup({
      date: new FormControl(),
      shoe: new FormControl(),
      distance: new FormControl(),
      startTime: new FormControl(),
      endTime: new FormControl(),
      pathEndTime: new FormControl(),
      averageHr: new FormControl(),
      maxHr: new FormControl(),
      elevationGain: new FormControl(),
      maxSpeed: new FormControl(),
      windDirection: new FormControl(),
      windSpeed: new FormControl(),
      wind: new FormControl(),
      temperature: new FormControl(),
      precipitation: new FormControl(),
      route: new FormControl(),
      numberAttempts: new FormControl(),
      numberSuccesses: new FormControl(),
      notes: new FormControl()
    });
  }

}
