import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HraciBComponent } from './hraci-b.component';

describe('HraciBComponent', () => {
  let component: HraciBComponent;
  let fixture: ComponentFixture<HraciBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HraciBComponent]
    });
    fixture = TestBed.createComponent(HraciBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
