import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { RouteService } from '../route/route.service';
import { Route } from '../route/route-model';
import { WeatherService } from '../weather/weather.service';
import { WindDirection } from '../weather/weather-model';
import { ShoeService } from '../shoe/shoe.service';
import { Shoe } from '../shoe/shoe-model';
import { RunService } from './run.service';
import { AlertService } from '../alert/alert.service';
import { GpxRequest } from '../common/common-model';
import { ActivatedRoute } from '@angular/router';
import { RecreationalRun, TrainingRun } from './run-model';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})

export class RunComponent implements OnInit {
  public routes: Route[];
  public windDirections: WindDirection[];
  public shoes: Shoe[];
  public runForm: FormGroup;
  private errorMessage: string;
  public runType: any;

  constructor(private routeService: RouteService,
    private weatherService: WeatherService,
    private shoeService: ShoeService,
    private runService: RunService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute) {
    this.runForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.runType = data;
    })
  
    this.loadRoutes();
    this.loadWindDirections();
    this.loadShoes();
  }

  public addRun() {
    var run: any;

    if (this.runType.name == 'training') {
      run = new TrainingRun();

      run.exerciseDate = this.runForm.controls['date'].value;
      run.shoe = this.runForm.controls['shoe'].value;
      run.equipmentId = run.shoe.id;
      run.shoe = null;
      run.route = this.runForm.controls['route'].value;
      run.routeId = run.route.id;
      run.route = null;
      run.quantity = this.runForm.controls['distance'].value;
      run.startTime = this.runForm.controls['startTime'].value;
      run.endTime = this.runForm.controls['endTime'].value;
      run.averageHr = this.runForm.controls['averageHr'].value;
      run.maxHr = this.runForm.controls['maxHr'].value;
      run.elevationGain = this.runForm.controls['elevationGain'].value;
      run.maxSpeed = this.runForm.controls['maxSpeed'].value;
      run.windSpeed = this.runForm.controls['windSpeed'].value;
      run.windDirection = this.runForm.controls['windDirection'].value.Direction;
      run.temperature = this.runForm.controls['temperature'].value;
      run.precipitation = this.runForm.controls['precipitation'].value === 'Yes';
      run.numberOfAttempts = this.runForm.controls['numberAttempts'].value;
      run.numberOfSuccesses = this.runForm.controls['numberSuccesses'].value;
      run.notes = this.runForm.controls['notes'].value;

      let gpxRequest = new GpxRequest();
      gpxRequest.TrainingRun = run;

      this.runService.postTrainingRun(gpxRequest)
        .subscribe(result => {
          this.alertService.success('Training run successfully added.');
          this.clearForm();
        }, error => {
          console.log(error);
          this.alertService.error('Training run was not successfully added.');
        });
    }
    else {
      run = new RecreationalRun();

      run.exerciseDate = this.runForm.controls['date'].value;
      run.shoe = this.runForm.controls['shoe'].value;
      run.equipmentId = run.shoe.id;
      run.shoe = null;
      run.route = this.runForm.controls['route'].value;
      run.routeId = run.route.id;
      run.route = null;
      run.quantity = this.runForm.controls['distance'].value;
      run.startTime = this.runForm.controls['startTime'].value;
      run.endTime = this.runForm.controls['endTime'].value;
      run.pathEndTime = this.runForm.controls['pathEndTime'].value;
      run.averageHr = this.runForm.controls['averageHr'].value;
      run.maxHr = this.runForm.controls['maxHr'].value;
      run.elevationGain = this.runForm.controls['elevationGain'].value;
      run.maxSpeed = this.runForm.controls['maxSpeed'].value;
      run.wind = this.runForm.controls['wind'].value;
      run.temperature = this.runForm.controls['temperature'].value;
      run.precipitation = this.runForm.controls['precipitation'].value === 'Yes';
      run.notes = this.runForm.controls['notes'].value;

      let gpxRequest = new GpxRequest();
      gpxRequest.RecreationalRun = run;

      this.runService.postRecreationalRun(gpxRequest)
        .subscribe(result => {
          this.alertService.success('Recreational run successfully added.');
          this.clearForm();
        }, error => {
          console.log(error);
          this.alertService.error('Recreational run was not successfully added.');
        });
    }
  }

  public importRun(){
    
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
    this.runForm.controls['distance'].setValue('');
    this.runForm.controls['startTime'].setValue('');
    this.runForm.controls['endTime'].setValue('');
    this.runForm.controls['pathEndTime'].setValue('');
    this.runForm.controls['averageHr'].setValue('');
    this.runForm.controls['maxHr'].setValue('');
    this.runForm.controls['elevationGain'].setValue('');
    this.runForm.controls['maxSpeed'].setValue('');
    this.runForm.controls['windSpeed'].setValue('');
    this.runForm.controls['windDirection'].setValue('');
    this.runForm.controls['wind'].setValue('');
    this.runForm.controls['temperature'].setValue('');
    this.runForm.controls['precipitation'].setValue('');
    this.runForm.controls['numberAttempts'].setValue('');
    this.runForm.controls['numberSuccesses'].setValue('');
    this.runForm.controls['notes'].setValue('');
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