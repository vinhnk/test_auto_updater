import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTokenListComponent } from './device-token.component';

describe('DeviceTokenComponent', () => {
  let component: DeviceTokenListComponent;
  let fixture: ComponentFixture<DeviceTokenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceTokenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTokenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
