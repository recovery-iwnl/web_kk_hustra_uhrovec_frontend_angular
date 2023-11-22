import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersBComponent } from './players-b.component';

describe('PlayersBComponent', () => {
  let component: PlayersBComponent;
  let fixture: ComponentFixture<PlayersBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersBComponent]
    });
    fixture = TestBed.createComponent(PlayersBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
