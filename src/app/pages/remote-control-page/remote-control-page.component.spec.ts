import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteControlPageComponent } from './remote-control-page.component';

describe('RemoteControlPageComponent', () => {
  let component: RemoteControlPageComponent;
  let fixture: ComponentFixture<RemoteControlPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteControlPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoteControlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
