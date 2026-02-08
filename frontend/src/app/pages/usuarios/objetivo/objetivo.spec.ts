import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Objetivo } from './objetivo';

describe('Objetivo', () => {
  let component: Objetivo;
  let fixture: ComponentFixture<Objetivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Objetivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Objetivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
