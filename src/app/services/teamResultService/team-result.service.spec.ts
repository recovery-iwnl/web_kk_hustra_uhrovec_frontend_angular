import { TestBed } from '@angular/core/testing';

import { TeamResultService } from './team-result.service';

describe('TeamResultService', () => {
  let service: TeamResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
