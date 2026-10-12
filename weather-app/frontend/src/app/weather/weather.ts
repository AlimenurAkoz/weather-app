import { Component, inject, signal } from '@angular/core';
import { WeatherApi, WeatherData } from '../weather-api';
@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private api = inject(WeatherApi);

  weather = signal<WeatherData | null>(null);
  error = signal('');

  constructor() {
    this.search('Isparta');
  }

  search(city: string) {
    this.error.set('');
    this.api.getWeather(city).subscribe({
      next: (data) => this.weather.set(data),
      error: () => {
        this.weather.set(null);
        this.error.set("Şehir bulunamadı veya API'ye ulaşılamadı");
      },
    });
  }
}
