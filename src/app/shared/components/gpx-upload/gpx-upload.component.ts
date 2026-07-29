import { Component, EventEmitter, Output } from '@angular/core';

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
      @if (error) {
        <span class="field-error">{{ error }}</span>
      }
    </div>
  `
})
export class GpxUploadComponent {
  @Output() gpxLoaded = new EventEmitter<string | null>();

  fileName: string | null = null;
  error: string | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.error = null;

    if (!file) {
      this.fileName = null;
      this.gpxLoaded.emit(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.fileName = file.name;
      this.gpxLoaded.emit(reader.result as string);
    };
    reader.onerror = () => {
      this.error = 'Could not read that file.';
      this.gpxLoaded.emit(null);
    };
    reader.readAsText(file);
  }
}
