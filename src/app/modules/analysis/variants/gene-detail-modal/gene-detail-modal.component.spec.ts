import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneDetailModalComponent } from './gene-detail-modal.component';

describe('GeneDetailModalComponent', () => {
  let component: GeneDetailModalComponent;
  let fixture: ComponentFixture<GeneDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneDetailModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
