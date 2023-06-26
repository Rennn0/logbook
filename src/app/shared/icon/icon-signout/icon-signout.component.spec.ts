import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSignoutComponent } from './icon-signout.component';

describe('IconSignoutComponent', () => {
  let component: IconSignoutComponent;
  let fixture: ComponentFixture<IconSignoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSignoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconSignoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
