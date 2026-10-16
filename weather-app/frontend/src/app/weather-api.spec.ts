import { TestBed } from '@angular/core/testing';

import { WeatherApi } from './weather-api';

describe('WeatherApi', () => {
  let service: WeatherApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
