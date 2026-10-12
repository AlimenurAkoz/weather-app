import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Weather } from './weather';

describe('Weather', () => {
  let component: Weather;
  let fixture: ComponentFixture<Weather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weather],
    }).compileComponents();

    fixture = TestBed.createComponent(Weather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
