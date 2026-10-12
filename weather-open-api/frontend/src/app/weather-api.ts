import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
}

interface GeocodingResponse {
  results?: { name: string; latitude: number; longitude: number }[];
}

interface ForecastResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
}

const WEATHER_CODES: Record<number, string> = {
  0: 'Açık',
  1: 'Çoğunlukla açık',
  2: 'Parçalı bulutlu',
  3: 'Kapalı',
  45: 'Sisli',
  48: 'Kırağılı sis',
  51: 'Hafif çise',
  53: 'Orta şiddetli çise',
  55: 'Yoğun çise',
  56: 'Hafif dondurucu çise',
  57: 'Yoğun dondurucu çise',
  61: 'Hafif yağmur',
  63: 'Orta şiddetli yağmur',
  65: 'Şiddetli yağmur',
  66: 'Hafif dondurucu yağmur',
  67: 'Şiddetli dondurucu yağmur',
  71: 'Hafif kar',
  73: 'Orta şiddetli kar',
  75: 'Yoğun kar',
  77: 'Kar taneleri',
  80: 'Hafif sağanak',
  81: 'Orta şiddetli sağanak',
  82: 'Şiddetli sağanak',
  85: 'Hafif kar sağanağı',
  86: 'Şiddetli kar sağanağı',
  95: 'Gök gürültülü fırtına',
  96: 'Hafif dolulu fırtına',
  99: 'Şiddetli dolulu fırtına',
};

@Injectable({ providedIn: 'root' })
export class WeatherApi {
  private http = inject(HttpClient);
  private geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  getWeather(city: string): Observable<WeatherData> {
    return this.http
      .get<GeocodingResponse>(this.geocodingUrl, {
        params: { name: city, count: 1, language: 'tr' },
      })
      .pipe(
        switchMap((geo) => {
          const place = geo.results?.[0];
          if (!place) {
            return throwError(() => new Error('Şehir bulunamadı'));
          }
          return this.http
            .get<ForecastResponse>(this.forecastUrl, {
              params: {
                latitude: place.latitude,
                longitude: place.longitude,
                current: 'temperature_2m,relative_humidity_2m,weather_code',
                timezone: 'auto',
              },
            })
            .pipe(
              map(
                (forecast): WeatherData => ({
                  city: place.name,
                  temperature: Math.round(forecast.current.temperature_2m),
                  description: WEATHER_CODES[forecast.current.weather_code] ?? 'Bilinmiyor',
                  humidity: forecast.current.relative_humidity_2m,
                }),
              ),
            );
        }),
      );
  }
}