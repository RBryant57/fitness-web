import { Bike } from "../bike/bike-model";
import { Route } from "../route/route-model";

export class TrainingRide {
    Id: number;
    exerciseDate: Date;
    startTime: Date;
    endTime: Date;
    rideTimeHours: number;
    rideTimeMinutes: number;
    rideTimeSeconds: number;
    quantity: number;
    averageHr: number;
    maxHr: number;
    averageCadence: number;
    maxSpeed: number;
    elevationGain: number;
    windSpeed: number;
    windDirection: string;
    precipitation: boolean;
    temperature: number;
    gpxJsonId: number | null;
    numberOfAttempts: number;
    numberOfSuccesses: number;
    notes: string;
    equipmentId: number;
    routeId: number;
    bike: Bike;
    route: Route;
}

export class RecreationalRide {
    id: number | null;
    exerciseDate: Date;
    rideTimeHours: number;
    rideTimeMinutes: number;
    rideTimeSeconds: number;
    pathEndTime: string;
    pathTimeHours: number;
    pathTimeMinutes: number;
    pathTimeSeconds: number;
    startTime: Date;
    endTime: Date;
    quantity: number;
    averageHr: number;
    maxHr: number;
    averageCadence: number;
    maxSpeed: number;
    elevationGain: number;
    wind: string;
    precipitation: boolean;
    temperature: number;
    gpxJsonId: number | null;
    routeId: number;
    equipmentId: number;
    bike: Bike;
    route: Route;
    notes: string;
}