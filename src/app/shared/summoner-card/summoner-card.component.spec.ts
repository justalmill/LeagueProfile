import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerCardComponent } from './summoner-card.component';

describe('SummonerCardComponent', () => {
  let component: SummonerCardComponent;
  let fixture: ComponentFixture<SummonerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
