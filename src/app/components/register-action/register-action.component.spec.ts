import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterActionComponent } from './register-action.component';

describe('RegisterActionComponent', () => {
  let component: RegisterActionComponent;
  let fixture: ComponentFixture<RegisterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
