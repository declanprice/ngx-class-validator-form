import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentMethodsFieldComponent } from './customer-payment-methods-field.component';

describe('CustomerPaymentMethodsFieldComponent', () => {
  let component: CustomerPaymentMethodsFieldComponent;
  let fixture: ComponentFixture<CustomerPaymentMethodsFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPaymentMethodsFieldComponent]
    });
    fixture = TestBed.createComponent(CustomerPaymentMethodsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
