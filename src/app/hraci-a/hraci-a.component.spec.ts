import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HraciAComponent } from './hraci-a.component';

describe('HraciAComponent', () => {
  let component: HraciAComponent;
  let fixture: ComponentFixture<HraciAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HraciAComponent]
    });
    fixture = TestBed.createComponent(HraciAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
