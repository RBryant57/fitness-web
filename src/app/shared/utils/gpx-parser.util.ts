/**
 * Parses GPX track files (as exported by Garmin and most other GPS devices)
 * into a summary of basic exercise stats. Used to pre-fill entry forms so
 * the user only has to type in what the device didn't record (equipment,
 * route, weather, notes, etc.).
 */

export interface GpxSummary {
  /** Instant of the first timed trackpoint, or null if the file has no <time> elements. */
  startTime: Date | null;
  /** Instant of the last timed trackpoint. */
  endTime: Date | null;
  /** Elapsed wall-clock time between the first and last trackpoint, in seconds. */
  elapsedSeconds: number | null;
  /** Elapsed time excluding stretches where speed drops near zero (paused/stopped), in seconds. */
  movingSeconds: number | null;
  /** Total track distance in miles, from cumulative point-to-point great-circle distance. */
  distanceMiles: number | null;
  /** Total climbing (sum of positive elevation deltas) in feet. */
  elevationGainFeet: number | null;
  /** Fastest instantaneous speed between two consecutive points, in mph. */
  maxSpeedMph: number | null;
  /** Mean heart rate across all points reporting one, in bpm. */
  averageHr: number | null;
  /** Peak heart rate across all points reporting one, in bpm. */
  maxHr: number | null;
  /** Mean cadence across all points reporting one, in the device's native units. */
  averageCadence: number | null;
  /** Mean ambient temperature across all points reporting one, in °F. */
  temperatureF: number | null;
  /** True if the file parsed as XML but contained no usable timed trackpoints. */
  empty: boolean;
}

const EARTH_RADIUS_METERS = 6371000;
const METERS_TO_MILES = 1 / 1609.344;
const METERS_TO_FEET = 3.28084;
const MPS_TO_MPH = 2.23694;
/** Speeds below this are treated as "stopped" when computing moving time. */
const STOPPED_THRESHOLD_MPS = 0.5;

interface TrackPoint {
  lat: number;
  lon: number;
  ele: number | null;
  time: Date | null;
  hr: number | null;
  cad: number | null;
  atemp: number | null;
}

const EMPTY_SUMMARY: GpxSummary = {
  startTime: null,
  endTime: null,
  elapsedSeconds: null,
  movingSeconds: null,
  distanceMiles: null,
  elevationGainFeet: null,
  maxSpeedMph: null,
  averageHr: null,
  maxHr: null,
  averageCadence: null,
  temperatureF: null,
  empty: true
};

/**
 * Finds the first descendant matching a local element name, ignoring
 * namespace prefix. Garmin's TrackPointExtension elements (hr, cad, atemp)
 * are namespaced (e.g. `gpxtpx:hr`), and prefixes vary between exporters,
 * so matching on `localName` is the reliable way to find them.
 */
function findDescendantByLocalName(parent: Element, localName: string): Element | null {
  const all = parent.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++) {
    if (all[i].localName === localName) {
      return all[i];
    }
  }
  return null;
}

function textOf(parent: Element, localName: string): string | null {
  const text = findDescendantByLocalName(parent, localName)?.textContent?.trim();
  return text ? text : null;
}

function haversineMeters(a: TrackPoint, b: TrackPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

function mean(values: number[]): number | null {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
}

export function parseGpxSummary(gpxText: string): GpxSummary {
  const doc = new DOMParser().parseFromString(gpxText, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return EMPTY_SUMMARY;
  }

  const points: TrackPoint[] = Array.from(doc.getElementsByTagName('trkpt'))
    .map(el => {
      const lat = parseFloat(el.getAttribute('lat') ?? '');
      const lon = parseFloat(el.getAttribute('lon') ?? '');
      const eleText = textOf(el, 'ele');
      const timeText = textOf(el, 'time');
      const hrText = textOf(el, 'hr');
      const cadText = textOf(el, 'cad');
      const atempText = textOf(el, 'atemp');
      return {
        lat,
        lon,
        ele: eleText !== null ? parseFloat(eleText) : null,
        time: timeText !== null ? new Date(timeText) : null,
        hr: hrText !== null ? parseFloat(hrText) : null,
        cad: cadText !== null ? parseFloat(cadText) : null,
        atemp: atempText !== null ? parseFloat(atempText) : null
      };
    })
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon));

  if (points.length === 0) {
    return EMPTY_SUMMARY;
  }

  const timedPoints = points.filter(p => p.time && !Number.isNaN(p.time.getTime()));
  const startTime = timedPoints.length ? timedPoints[0].time : null;
  const endTime = timedPoints.length ? timedPoints[timedPoints.length - 1].time : null;
  const elapsedSeconds = startTime && endTime ? (endTime.getTime() - startTime.getTime()) / 1000 : null;

  let distanceMeters = 0;
  let elevationGainMeters = 0;
  let movingSeconds = 0;
  let maxSpeedMps = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const segMeters = haversineMeters(prev, curr);
    distanceMeters += segMeters;

    if (prev.ele !== null && curr.ele !== null && curr.ele > prev.ele) {
      elevationGainMeters += curr.ele - prev.ele;
    }

    if (prev.time && curr.time) {
      const dtSeconds = (curr.time.getTime() - prev.time.getTime()) / 1000;
      if (dtSeconds > 0) {
        const speedMps = segMeters / dtSeconds;
        if (speedMps > STOPPED_THRESHOLD_MPS) {
          movingSeconds += dtSeconds;
          maxSpeedMps = Math.max(maxSpeedMps, speedMps);
        }
      }
    }
  }

  const hrValues = points.map(p => p.hr).filter((v): v is number => v !== null && Number.isFinite(v));
  const cadValues = points.map(p => p.cad).filter((v): v is number => v !== null && Number.isFinite(v));
  const atempValues = points.map(p => p.atemp).filter((v): v is number => v !== null && Number.isFinite(v));
  const avgAtempC = mean(atempValues);

  return {
    startTime,
    endTime,
    elapsedSeconds,
    movingSeconds: timedPoints.length > 1 ? movingSeconds : null,
    distanceMiles: distanceMeters * METERS_TO_MILES,
    elevationGainFeet: elevationGainMeters * METERS_TO_FEET,
    maxSpeedMph: timedPoints.length > 1 ? maxSpeedMps * MPS_TO_MPH : null,
    averageHr: mean(hrValues),
    maxHr: hrValues.length ? Math.max(...hrValues) : null,
    averageCadence: mean(cadValues),
    temperatureF: avgAtempC !== null ? avgAtempC * 1.8 + 32 : null,
    empty: false
  };
}

/** Splits a whole number of seconds into hours/minutes/seconds components. */
export function secondsToHms(totalSeconds: number): { hours: number; minutes: number; seconds: number } {
  const total = Math.max(0, Math.round(totalSeconds));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60
  };
}

/** Formats seconds as "H:MM:SS" (or "M:SS" under an hour) for a compact UI hint. */
export function formatDurationShort(totalSeconds: number): string {
  const { hours, minutes, seconds } = secondsToHms(totalSeconds);
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}