import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherApi {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000';

  getWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.baseUrl}/weather`, { params: { city } });
  }
}