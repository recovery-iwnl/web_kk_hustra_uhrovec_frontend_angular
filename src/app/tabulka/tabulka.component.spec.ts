import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulkaComponent } from './tabulka.component';

describe('TabulkaComponent', () => {
  let component: TabulkaComponent;
  let fixture: ComponentFixture<TabulkaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabulkaComponent]
    });
    fixture = TestBed.createComponent(TabulkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
