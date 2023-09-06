import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddressFieldComponent } from './customer-address-field.component';

describe('CustomerAddressFieldComponent', () => {
  let component: CustomerAddressFieldComponent;
  let fixture: ComponentFixture<CustomerAddressFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAddressFieldComponent]
    });
    fixture = TestBed.createComponent(CustomerAddressFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
