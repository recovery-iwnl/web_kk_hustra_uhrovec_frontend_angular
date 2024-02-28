import { TestBed } from '@angular/core/testing';

import { PlayerResultService } from './player-result.service';

describe('PlayerResultService', () => {
  let service: PlayerResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
