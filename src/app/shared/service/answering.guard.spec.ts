import { TestBed } from '@angular/core/testing';

import { AnsweringGuard } from './answering.guard';

describe('AnsweringGuard', () => {
  let guard: AnsweringGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AnsweringGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
