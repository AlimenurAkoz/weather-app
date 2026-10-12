import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;

  hourly: {
    time: string;
    temperature: number;
    apparentTemperature: number;
    precipitationProbability: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
  }[];

  daily: {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationProbability: number;
    precipitation: number;
    weatherCode: number;
    sunrise: string;
    sunset: string;
  }[];
}

export interface CitySuggestion {
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: {
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    country_code?: string;
    admin1?: string;
  }[];
}

interface ForecastResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    weather_code: number[];
  };

  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
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

  private geocodingUrl =
    'https://geocoding-api.open-meteo.com/v1/search';

  private forecastUrl =
    'https://api.open-meteo.com/v1/forecast';

  getSuggestions(city: string): Observable<CitySuggestion[]> {
    const value = city.trim();

    if (value.length < 2) {
      return of([]);
    }

    return this.http
      .get<GeocodingResponse>(this.geocodingUrl, {
        params: {
          name: value,
          count: 8,
          language: 'tr',
        },
      })
      .pipe(
        map((response) =>
          (response.results ?? []).map((place) => ({
            name: place.name,
            country: place.country ?? '',
            countryCode: place.country_code ?? '',
            admin1: place.admin1,
            latitude: place.latitude,
            longitude: place.longitude,
          })),
        ),
      );
  }

  getWeather(city: string): Observable<WeatherData> {
    return this.http
      .get<GeocodingResponse>(this.geocodingUrl, {
        params: {
          name: city.trim(),
          count: 1,
          language: 'tr',
        },
      })
      .pipe(
        switchMap((geo) => {
          const place = geo.results?.[0];

          if (!place) {
            return throwError(
              () => new Error('Şehir bulunamadı'),
            );
          }

          return this.http
            .get<ForecastResponse>(this.forecastUrl, {
              params: {
                latitude: place.latitude,
                longitude: place.longitude,

                current:
                  'temperature_2m,relative_humidity_2m,weather_code',

                hourly:
                  'temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,weather_code',

                daily:
                  'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code,sunrise,sunset',

                forecast_days: 7,

                timezone: 'auto',
              },
            })
            .pipe(
              map(
                (forecast): WeatherData => ({
                  city: place.name,

                  country: place.country ?? '',

                  temperature: Math.round(
                    forecast.current.temperature_2m,
                  ),

                  description:
                    WEATHER_CODES[
                      forecast.current.weather_code
                    ] ?? 'Bilinmiyor',

                  humidity:
                    forecast.current.relative_humidity_2m,

                  hourly: forecast.hourly.time.map(
                    (time, index) => ({
                      time,

                      temperature: Math.round(
                        forecast.hourly.temperature_2m[index],
                      ),

                      apparentTemperature: Math.round(
                        forecast.hourly.apparent_temperature[index],
                      ),

                      precipitationProbability:
                        forecast.hourly
                          .precipitation_probability[index],

                      precipitation:
                        forecast.hourly.precipitation[index],

                      windSpeed: Math.round(
                        forecast.hourly.wind_speed_10m[index],
                      ),

                      weatherCode:
                        forecast.hourly.weather_code[index],
                    }),
                  ),

                  daily: forecast.daily.time.map(
                    (date, index) => ({
                      date,

                      temperatureMax: Math.round(
                        forecast.daily.temperature_2m_max[index],
                      ),

                      temperatureMin: Math.round(
                        forecast.daily.temperature_2m_min[index],
                      ),

                      precipitationProbability:
                        forecast.daily
                          .precipitation_probability_max[index],

                      precipitation:
                        forecast.daily.precipitation_sum[index],

                      weatherCode:
                        forecast.daily.weather_code[index],

                      sunrise:
                        forecast.daily.sunrise[index],

                      sunset:
                        forecast.daily.sunset[index],
                    }),
                  ),
                }),
              ),
            );
        }),
      );
  }

  getWeatherDescription(weatherCode: number): string {
    return WEATHER_CODES[weatherCode] ?? 'Bilinmiyor';
  }
}