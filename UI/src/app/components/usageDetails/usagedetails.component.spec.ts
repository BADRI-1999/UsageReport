import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDetailsComponent } from './usagedetails.component';

describe('UsageDetailsComponent', () => {
  let component: UsageDetailsComponent;
  let fixture: ComponentFixture<UsageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
