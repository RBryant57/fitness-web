/** Formats separate hours/minutes/seconds fields as "H:MM:SS". */
export function formatHms(hours: number, minutes: number, seconds: number): string {
  const h = hours ?? 0;
  const m = (minutes ?? 0).toString().padStart(2, '0');
  const s = (seconds ?? 0).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/** Formats a nullable decimal to a fixed number of places, or a dash if absent. */
export function formatDecimal(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return value.toFixed(digits);
}

/** Converts an ISO datetime string to a `datetime-local` input value. */
export function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Converts an ISO datetime string to a `date` input value (yyyy-MM-dd). */
export function toDateInput(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
