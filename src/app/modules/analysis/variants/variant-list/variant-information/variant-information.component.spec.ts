import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantInformationComponent } from './variant-information.component';

describe('VariantInformationComponent', () => {
  let component: VariantInformationComponent;
  let fixture: ComponentFixture<VariantInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
