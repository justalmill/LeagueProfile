import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerMasteryComponent } from './summoner-mastery.component';

describe('SummonerMasteryComponent', () => {
  let component: SummonerMasteryComponent;
  let fixture: ComponentFixture<SummonerMasteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummonerMasteryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerMasteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
