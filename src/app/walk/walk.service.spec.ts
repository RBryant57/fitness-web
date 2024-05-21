import { TestBed } from '@angular/core/testing';

import { WalkService } from './walk.service';

describe('WalkService', () => {
  let service: WalkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
