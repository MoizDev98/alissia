import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Peso } from './peso';

describe('Peso', () => {
  let component: Peso;
  let fixture: ComponentFixture<Peso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Peso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Peso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
