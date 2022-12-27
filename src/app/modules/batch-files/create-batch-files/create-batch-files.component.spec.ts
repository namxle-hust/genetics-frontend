import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchFilesComponent } from './create-batch-files.component';

describe('CreateBatchFilesComponent', () => {
  let component: CreateBatchFilesComponent;
  let fixture: ComponentFixture<CreateBatchFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBatchFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBatchFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
