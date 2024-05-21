import { Route } from "../route/route-model";
import { Shoe } from "../shoe/shoe-model";

export class TrainingRun {
    Id: number;
    exerciseDate: Date;
    startTime: Date;
    endTime: Date;
    walkTimeHours: number;
    walkTimeMinutes: number;
    walkTimeSeconds: number;
    quantity: number;
    averageHr: number;
    maxHr: number;
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
    shoe: Shoe;
    route: Route;
}

export class RecreationalRun {
    id: number | null;
    exerciseDate: Date;
    walkTimeHours: number;
    walkTimeMinutes: number;
    walkTimeSeconds: number;
    pathEndTime: string;
    pathTimeHours: number;
    pathTimeMinutes: number;
    pathTimeSeconds: number;
    startTime: Date;
    endTime: Date;
    quantity: number;
    averageHr: number;
    maxHr: number;
    maxSpeed: number;
    elevationGain: number;
    wind: string;
    precipitation: boolean;
    temperature: number;
    gpxJsonId: number | null;
    routeId: number;
    equipmentId: number;
    shoe: Shoe;
    route: Route;
    notes: string;
}