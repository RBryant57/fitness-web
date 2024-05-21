import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BikeComponent } from './bike/bike.component';
import { WalkComponent } from './walk/walk.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { RouteComponent } from './route/route.component';
import { WeatherComponent } from './weather/weather.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShoeComponent } from './shoe/shoe.component';
import { AlertComponent } from './alert/alert.component';
import { CommonComponent } from './common/common.component';
import { RideComponent } from './ride/ride.component';
import { RunComponent } from './run/run.component';

@NgModule({
  declarations: [
    AppComponent,
    BikeComponent,
    WalkComponent,
    NavMenuComponent,
    HomeComponent,
    RouteComponent,
    WeatherComponent,
    ShoeComponent,
    AlertComponent,
    CommonComponent,
    RideComponent,
    RunComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'tride', component: RideComponent, data:{name:'training'} },
      { path: 'rride', component: RideComponent, data:{name:'recreational'} },
      { path: 'trun', component: RunComponent, data:{name:'training'} },
      { path: 'rrun', component: RunComponent, data:{name:'recreational'} },
      { path: 'twalk', component: WalkComponent, data:{name:'training'} },
      { path: 'rwalk', component: WalkComponent, data:{name:'recreational'} }
    ]),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
