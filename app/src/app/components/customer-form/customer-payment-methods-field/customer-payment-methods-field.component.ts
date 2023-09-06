import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormArray } from '@angular/forms';
import { CustomerPaymentMethod } from '../../../models/Customer';
import { makeZodForm } from '@declanprice/ngx-make-form';

@Component({
  selector: 'app-customer-payment-methods-field',
  templateUrl: './customer-payment-methods-field.component.html',
  styleUrls: ['./customer-payment-methods-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPaymentMethodsFieldComponent {
  constructor(public controlContainer: ControlContainer) {}

  get formArray() {
    return this.controlContainer.control as any;
  }

  add() {
    (this.formArray as FormArray).push(makeZodForm(CustomerPaymentMethod));
  }

  remove(index: number) {
    (this.formArray as FormArray).removeAt(index);
  }
}
