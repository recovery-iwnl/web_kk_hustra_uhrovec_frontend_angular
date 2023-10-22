import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VysledkyComponent } from './vysledky.component';

describe('VysledkyComponent', () => {
  let component: VysledkyComponent;
  let fixture: ComponentFixture<VysledkyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VysledkyComponent]
    });
    fixture = TestBed.createComponent(VysledkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
