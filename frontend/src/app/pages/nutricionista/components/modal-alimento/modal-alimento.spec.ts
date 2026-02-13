import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlimento } from './modal-alimento';

describe('ModalAlimento', () => {
  let component: ModalAlimento;
  let fixture: ComponentFixture<ModalAlimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAlimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAlimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
