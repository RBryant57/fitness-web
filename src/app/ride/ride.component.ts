import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouteService } from '../route/route.service';
import { Route } from '../route/route-model';
import { WeatherService } from '../weather/weather.service';
import { WindDirection } from '../weather/weather-model';
import { RecreationalRide, TrainingRide } from './ride-model';
import { AlertService } from '../alert/alert.service';
import { GpxRequest } from '../common/common-model';
import { ActivatedRoute } from '@angular/router';
import { Bike } from '../bike/bike-model';
import { BikeService } from '../bike/bike.service';
import { RideService } from './ride.service';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.component.html',
  styleUrls: ['./ride.component.css']
})

export class RideComponent implements OnInit {
  public routes: Route[];
  public windDirections: WindDirection[];
  public bikes: Bike[];
  public rideForm: FormGroup;
  private errorMessage: string;
  public rideType: any;

  constructor(private routeService: RouteService,
    private weatherService: WeatherService,
    private bikeService: BikeService,
    private rideService: RideService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute) {
    this.rideForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.rideType = data;
    })
  
    this.loadRoutes();
    this.loadWindDirections();
    this.loadBikes();
  }

  public addRide() {
    var ride: any;

    if (this.rideType.name == 'training') {
      ride = new TrainingRide();

      ride.exerciseDate = this.rideForm.controls['date'].value;
      ride.shoe = this.rideForm.controls['shoe'].value;
      ride.equipmentId = ride.shoe.id;
      ride.shoe = null;
      ride.route = this.rideForm.controls['route'].value;
      ride.routeId = ride.route.id;
      ride.route = null;
      ride.quantity = this.rideForm.controls['distance'].value;
      ride.startTime = this.rideForm.controls['startTime'].value;
      ride.endTime = this.rideForm.controls['endTime'].value;
      ride.averageHr = this.rideForm.controls['averageHr'].value;
      ride.maxHr = this.rideForm.controls['maxHr'].value;
      ride.elevationGain = this.rideForm.controls['elevationGain'].value;
      ride.maxSpeed = this.rideForm.controls['maxSpeed'].value;
      ride.windSpeed = this.rideForm.controls['windSpeed'].value;
      ride.windDirection = this.rideForm.controls['windDirection'].value.Direction;
      ride.temperature = this.rideForm.controls['temperature'].value;
      ride.precipitation = this.rideForm.controls['precipitation'].value === 'Yes';
      ride.numberOfAttempts = this.rideForm.controls['numberAttempts'].value;
      ride.numberOfSuccesses = this.rideForm.controls['numberSuccesses'].value;
      ride.notes = this.rideForm.controls['notes'].value;

      let gpxRequest = new GpxRequest();
      gpxRequest.TrainingRide = ride;

      this.rideService.postTrainingRide(gpxRequest)
        .subscribe(result => {
          this.alertService.success('Training ride successfully added.');
          this.clearForm();
        }, error => {
          console.log(error);
          this.alertService.error('Training ride was not successfully added.');
        });
    }
    else {
      ride = new RecreationalRide();

      ride.exerciseDate = this.rideForm.controls['date'].value;
      ride.shoe = this.rideForm.controls['shoe'].value;
      ride.equipmentId = ride.shoe.id;
      ride.shoe = null;
      ride.route = this.rideForm.controls['route'].value;
      ride.routeId = ride.route.id;
      ride.route = null;
      ride.quantity = this.rideForm.controls['distance'].value;
      ride.startTime = this.rideForm.controls['startTime'].value;
      ride.endTime = this.rideForm.controls['endTime'].value;
      ride.pathEndTime = this.rideForm.controls['pathEndTime'].value;
      ride.averageHr = this.rideForm.controls['averageHr'].value;
      ride.maxHr = this.rideForm.controls['maxHr'].value;
      ride.elevationGain = this.rideForm.controls['elevationGain'].value;
      ride.maxSpeed = this.rideForm.controls['maxSpeed'].value;
      ride.wind = this.rideForm.controls['wind'].value;
      ride.temperature = this.rideForm.controls['temperature'].value;
      ride.precipitation = this.rideForm.controls['precipitation'].value === 'Yes';
      ride.notes = this.rideForm.controls['notes'].value;

      let gpxRequest = new GpxRequest();
      gpxRequest.RecreationalRide = ride;

      this.rideService.postRecreationalRide(gpxRequest)
        .subscribe(result => {
          this.alertService.success('Recreational ride successfully added.');
          this.clearForm();
        }, error => {
          console.log(error);
          this.alertService.error('Recreational ride was not successfully added.');
        });
    }
  }

  public importRide(){
    
  }

  private loadRoutes() {
    this.routeService.getEntities().subscribe(
      routes => {
        this.routes = routes;
      },
      error => this.errorMessage = <any>error
    );
  }

  private loadBikes() {
    this.bikeService.getEntities().subscribe(
      bikes => {
        this.bikes = bikes;
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
    this.rideForm.controls['distance'].setValue('');
    this.rideForm.controls['startTime'].setValue('');
    this.rideForm.controls['endTime'].setValue('');
    this.rideForm.controls['pathEndTime'].setValue('');
    this.rideForm.controls['averageHr'].setValue('');
    this.rideForm.controls['maxHr'].setValue('');
    this.rideForm.controls['elevationGain'].setValue('');
    this.rideForm.controls['maxSpeed'].setValue('');
    this.rideForm.controls['windSpeed'].setValue('');
    this.rideForm.controls['windDirection'].setValue('');
    this.rideForm.controls['wind'].setValue('');
    this.rideForm.controls['temperature'].setValue('');
    this.rideForm.controls['precipitation'].setValue('');
    this.rideForm.controls['numberAttempts'].setValue('');
    this.rideForm.controls['numberSuccesses'].setValue('');
    this.rideForm.controls['notes'].setValue('');
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
