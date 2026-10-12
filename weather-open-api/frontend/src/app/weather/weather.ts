import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  WeatherApi,
  WeatherData,
  CitySuggestion,
} from '../weather-api';

import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  of,
} from 'rxjs';

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

  suggestions = signal<CitySuggestion[]>([]);
  showSuggestions = signal(false);

  loading = signal(false);

  selectedDay = signal(0);

  private searchSubject = new Subject<string>();

  constructor() {
    this.search('Isparta');

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),

        switchMap((value) => {
          if (value.trim().length < 2) {
            return of([]);
          }

          return this.api.getSuggestions(value);
        }),
      )
      .subscribe({
        next: (data) => {
          this.suggestions.set(data);
          this.showSuggestions.set(data.length > 0);
        },

        error: () => {
          this.suggestions.set([]);
          this.showSuggestions.set(false);
        },
      });
  }

  onInput(value: string) {
    this.searchSubject.next(value);
  }

  search(city: string) {
    const value = city.trim();

    if (!value) {
      return;
    }

    this.error.set('');
    this.loading.set(true);
    this.showSuggestions.set(false);

    this.api.getWeather(value).subscribe({
      next: (data) => {
        this.weather.set(data);

        // Yeni şehir arandığında ilk gün seçili olsun.
        this.selectedDay.set(0);

        this.loading.set(false);
      },

      error: () => {
        this.weather.set(null);
        this.loading.set(false);

        this.error.set(
          "Şehir bulunamadı veya API'ye ulaşılamadı",
        );

        this.trySuggestion(value);
      },
    });
  }

  selectSuggestion(suggestion: CitySuggestion) {
    this.search(suggestion.name);

    this.suggestions.set([]);
    this.showSuggestions.set(false);
  }

  selectDay(index: number) {
    this.selectedDay.set(index);
  }

  getSelectedDayHours(weather: WeatherData) {
    const selectedDate =
      weather.daily[this.selectedDay()]?.date;

    if (!selectedDate) {
      return [];
    }

    return weather.hourly.filter((hour) =>
      hour.time.startsWith(selectedDate),
    );
  }

  formatHour(value: string): string {
    const date = new Date(value);

    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatShortHour(value: string): string {
    const date = new Date(value);

    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
    });
  }

  formatDay(value: string): string {
    const date = new Date(`${value}T12:00:00`);

    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  getWeatherDescription(code: number): string {
    return this.api.getWeatherDescription(code);
  }

  private trySuggestion(value: string) {
    const shortenedValue =
      value.length > 3
        ? value.substring(0, value.length - 1)
        : value;

    this.api.getSuggestions(shortenedValue).subscribe({
      next: (suggestions) => {
        if (suggestions.length > 0) {
          this.suggestions.set(
            suggestions.slice(0, 3),
          );

          this.showSuggestions.set(false);
        }
      },
    });
  }
}