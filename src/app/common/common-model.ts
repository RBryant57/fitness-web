import { RecreationalRide, TrainingRide } from "../ride/ride-model";
import { RecreationalRun, TrainingRun } from "../run/run-model";
import { RecreationalWalk, TrainingWalk } from "../walk/walk-model";

export class GpxRequest{
    TrainingRide: TrainingRide;
    RecreationalRide: RecreationalRide;
    TrainingRun: TrainingRun;
    RecreationalRun: RecreationalRun;
    TrainingWalk: TrainingWalk;
    RecreationalWalk: RecreationalWalk;
    Gpx: string;
}