import { Component, EventEmitter, Output } from '@angular/core';

import { formatDurationShort, GpxSummary, parseGpxSummary } from '../../utils/gpx-parser.util';

@Component({
  selector: 'app-gpx-upload',
  standalone: true,
  template: `
    <div class="field">
      <label for="gpxFile">GPX track (optional)</label>
      <input id="gpxFile" type="file" accept=".gpx,application/gpx+xml,text/xml" (change)="onFileChange($event)" />
      @if (fileName) {
        <span class="hint">Loaded {{ fileName }}</span>
      }
      @if (summaryHint) {
        <span class="hint">{{ summaryHint }}</span>
      }
      @if (error) {
        <span class="field-error">{{ error }}</span>
      }
    </div>
  `
})
export class GpxUploadComponent {
  @Output() gpxLoaded = new EventEmitter<string | null>();
  /** Emits parsed ride/run/walk stats from the file, or null if none could be extracted. */
  @Output() summaryLoaded = new EventEmitter<GpxSummary | null>();

  fileName: string | null = null;
  summaryHint: string | null = null;
  error: string | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.error = null;
    this.summaryHint = null;

    if (!file) {
      this.fileName = null;
      this.gpxLoaded.emit(null);
      this.summaryLoaded.emit(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      this.fileName = file.name;
      // Always emit the raw file, even if we can't parse stats out of it —
      // it still gets attached to the saved record.
      this.gpxLoaded.emit(text);

      let summary: GpxSummary | null = null;
      try {
        summary = parseGpxSummary(text);
      } catch {
        summary = null;
      }

      if (!summary || summary.empty) {
        this.summaryHint = "Track attached, but couldn't read ride data from it — please fill in the fields manually.";
        this.summaryLoaded.emit(null);
        return;
      }

      const parts: string[] = [];
      if (summary.distanceMiles !== null) {
        parts.push(`${summary.distanceMiles.toFixed(2)} mi`);
      }
      if (summary.movingSeconds !== null) {
        parts.push(`${formatDurationShort(summary.movingSeconds)} moving time`);
      }
      this.summaryHint =
        (parts.length ? parts.join(' · ') + ' — ' : '') + 'fields below pre-filled, double-check before saving.';
      this.summaryLoaded.emit(summary);
    };
    reader.onerror = () => {
      this.error = 'Could not read that file.';
      this.gpxLoaded.emit(null);
      this.summaryLoaded.emit(null);
    };
    reader.readAsText(file);
  }
}