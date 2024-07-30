import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDelDialogComponent } from './confirm-del-dialog.component';

describe('ConfirmDelDialogComponent', () => {
  let component: ConfirmDelDialogComponent;
  let fixture: ComponentFixture<ConfirmDelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmDelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
