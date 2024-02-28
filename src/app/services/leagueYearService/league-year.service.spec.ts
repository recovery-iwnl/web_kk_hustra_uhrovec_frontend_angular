import { TestBed } from '@angular/core/testing';

import { LeagueYearService } from './league-year.service';

describe('LeagueYearService', () => {
  let service: LeagueYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
