import { TestBed } from '@angular/core/testing';

import { HabitActionsService } from './habit-actions.service';

describe('HabitActionsService', () => {
  let service: HabitActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
