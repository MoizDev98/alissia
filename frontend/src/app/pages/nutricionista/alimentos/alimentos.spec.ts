import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alimentos } from './alimentos';

describe('Alimentos', () => {
  let component: Alimentos;
  let fixture: ComponentFixture<Alimentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alimentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Alimentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
