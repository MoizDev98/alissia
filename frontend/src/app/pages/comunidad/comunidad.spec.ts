import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comunidad } from './comunidad';

describe('Comunidad', () => {
  let component: Comunidad;
  let fixture: ComponentFixture<Comunidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comunidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comunidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
