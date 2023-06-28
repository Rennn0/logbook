import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCourseComponent } from './plan-course.component';

describe('PlanCourseComponent', () => {
  let component: PlanCourseComponent;
  let fixture: ComponentFixture<PlanCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
