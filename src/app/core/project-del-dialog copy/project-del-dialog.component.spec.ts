import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDelDialogComponent } from './project-del-dialog.component';

describe('ConfirmDelDialogComponent', () => {
  let component: ProjectDelDialogComponent;
  let fixture: ComponentFixture<ProjectDelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
