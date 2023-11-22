import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersAComponent } from './players-a.component';

describe('PlayersAComponent', () => {
  let component: PlayersAComponent;
  let fixture: ComponentFixture<PlayersAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersAComponent]
    });
    fixture = TestBed.createComponent(PlayersAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
