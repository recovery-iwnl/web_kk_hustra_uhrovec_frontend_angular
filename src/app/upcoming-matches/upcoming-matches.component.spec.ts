import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingMatchesComponent } from './upcoming-matches.component';

describe('UpcomingMatchesComponent', () => {
  let component: UpcomingMatchesComponent;
  let fixture: ComponentFixture<UpcomingMatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingMatchesComponent]
    });
    fixture = TestBed.createComponent(UpcomingMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
