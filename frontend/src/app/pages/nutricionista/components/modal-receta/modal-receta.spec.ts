import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReceta } from './modal-receta';

describe('ModalReceta', () => {
  let component: ModalReceta;
  let fixture: ComponentFixture<ModalReceta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalReceta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalReceta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
